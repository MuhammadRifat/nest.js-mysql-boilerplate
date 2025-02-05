import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomInt } from 'crypto';
import { IPaginate } from 'src/common/dtos/dto.common';
import * as sharp from 'sharp';
import { parse } from 'path';
import { S3Service } from '../s3/s3.service';
import { FileLibrary } from './schema/file-library.schema';
import { MysqlService } from 'src/common/services/mysql-service.common';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { DB_TABLES } from 'src/common/enums/db.enum';
import { User } from '../user/entities/user.entity';

@Injectable()
export class FileLibraryService extends MysqlService<FileLibrary> {
  // private THUMBNAIL = { width: 200, height: 200 };
  // private PREVIEW = { width: 640, height: 480 };

  constructor(
    @InjectConnection() private knex: Knex<any, FileLibrary[]>,
    private readonly s3Service: S3Service
  ) {
    super(knex, DB_TABLES.FILE_LIBRARY);
  }

  async compressImage(inputBuffer: Buffer) {
    const metadata = await sharp(inputBuffer).metadata();

    let outputBuffer = await sharp(inputBuffer)
      .resize(metadata.width, metadata.height, {
        fit: sharp.fit.inside, 
        withoutEnlargement: true,
      })
      .webp({ quality: 70 })
      .toBuffer();

    return {
      imageBuffer: outputBuffer,
      mimetype: 'image/webp',
      ext: '.webp'
    };
  }

  // create new image
  async uploadImages(files: Express.Multer.File[], user: User) {

    if (!files || !files.length) {
      throw new BadRequestException('file required');
    }

    // validate image
    this.validateImages(files);

    // get original files
    const originalFiles = files.map(async (file) => {
      const compressOutput = await this.compressImage(file.buffer);

      const originalName = parse(file.originalname).name;
      // const extension = parse(file.originalname).ext;
      const fileName = this.fileNameGenerator(originalName, compressOutput.ext);


      return {
        fieldName: file.fieldname,
        fileName: fileName,
        buffer: compressOutput.imageBuffer,
        mimetype: compressOutput.mimetype,
        size: file.size
      };
    });
    const originalResolvedFiles = await Promise.all(originalFiles);

    // convert file to preview and thumbnail
    // const previewResolvedFiles = await this.convertFileForPreview(originalResolvedFiles);
    // const thumbnailResolvedFiles = await this.convertFileFroThumbnail(originalResolvedFiles);

    const originalUploadPromise = await this.s3Service.uploadMultipleFiles(originalResolvedFiles);
    // const previewUploadPromise = this.s3Service.uploadMultipleFiles(previewResolvedFiles, process.env.IMG_PREVIEW || 'preview');
    // const thumbnailUploadPromise = this.s3Service.uploadMultipleFiles(thumbnailResolvedFiles, process.env.IMG_THUMBNAIL || 'thumbnail');

    // const [uploadedFiles] = await Promise.all([originalUploadPromise, previewUploadPromise, thumbnailUploadPromise]);
    const [uploadedFiles] = await Promise.all([originalUploadPromise]);

    const fileNames: FileLibrary[] = [];
    const response = uploadedFiles.map(file => {
      fileNames.push({
        name: file.fileName,
        userId: user?.id,
        mimetype: file.mimetype,
        size: file.size
      });

      return {
        fileName: file.fileName,
        fieldName: file.fieldName
      };
    });

    // save to database
    await this.createMany(fileNames);
    return response;
  }

  async uploadFiles(files: Express.Multer.File[], user: User) {

    if (!files || !files.length) {
      throw new BadRequestException('file required');
    }

    // get original files
    const originalFiles = files.map(async (file) => {
      // const compressOutput = await this.compressImage(file.buffer);

      const originalName = parse(file.originalname).name;
      const extension = parse(file.originalname).ext;
      const fileName = this.fileNameGenerator(originalName, extension);


      return {
        fieldName: file.fieldname,
        fileName: fileName,
        buffer: file.buffer,
        mimetype: file.mimetype,
        size: file.size
      };
    });
    const originalResolvedFiles = await Promise.all(originalFiles);

    const originalUploadPromise = await this.s3Service.uploadMultipleFiles(originalResolvedFiles);
    const [uploadedFiles] = await Promise.all([originalUploadPromise]);

    const fileNames: FileLibrary[] = [];
    const response = uploadedFiles.map(file => {
      fileNames.push({
        name: file.fileName,
        userId: user?.id,
        mimetype: file.mimetype,
        size: file.size
      });

      return {
        fileName: file.fileName,
        fieldName: file.fieldName
      };
    });

    // save to database
    await this.createMany(fileNames);
    return response;
  }

  private validateImages(files: Express.Multer.File[]): boolean {
    // const MAX_FILE_SIZE = 10 * 1024 * 1024;  // 10MB in bytes
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/jpg',
      'image/gif',
      'image/bmp',
      'image/tiff',
      'image/svg+xml',
      'image/heic',
    ];

    for (const file of files) {
      // Check for valid MIME type
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(`invalid image. only allowed 'jpeg','png', 'webp','jpg', 'gif', 'bmp', 'tiff','svg+xml','heic'`)
      }

      // Check for file size (max 10MB)
      // if (file.size > MAX_FILE_SIZE) {
      //   throw new BadRequestException('max file size is 10MB.')
      // }
    }
    return true;
  }

  // private async convertFileForPreview(originalResolvedFiles: IUploadFile[]) {
  //   // resize to previews
  //   const previewFiles = originalResolvedFiles.map(async (file) => {

  //     const previewBuffer = await sharp(file.buffer)
  //       .resize(this.PREVIEW.width, this.PREVIEW.height)
  //       .webp({ effort: 3 })
  //       .toBuffer();

  //     return { ...file, buffer: previewBuffer };
  //   });

  //   return await Promise.all(previewFiles);
  // }

  // private async convertFileFroThumbnail(originalResolvedFiles: IUploadFile[]) {
  //   // resize to thumbnails
  //   const thumbnailFiles = originalResolvedFiles.map(async (file) => {

  //     const thumbnailBuffer = await sharp(file.buffer)
  //       .resize(this.THUMBNAIL.width, this.THUMBNAIL.height)
  //       .webp({ effort: 3 })
  //       .toBuffer();

  //     return { ...file, buffer: thumbnailBuffer };
  //   });

  //   return await Promise.all(thumbnailFiles);
  // }

  
  // find all by paginate
  async findAll(paginate: IPaginate) {
    return await this.findWithPaginate(paginate);
  }

  // find one by id
  async findOne(id: number) {
    const data = await this.findOneById(id);

    if (!data) {
      throw new NotFoundException('customer not found');
    }

    return data;
  }

  // remove file by id
  async remove(id: number) {
    const file = await this.removeById(id);

    if (!file) {
      throw new NotFoundException('file not found');
    }

    await Promise.all([this.s3Service.deleteFile(file.name, process.env.IMG_ORIGINAL || 'original'),
    this.s3Service.deleteFile(file.name, process.env.IMG_PREVIEW || 'preview'),
    this.s3Service.deleteFile(file.name, process.env.IMG_THUMBNAIL || 'thumbnail')
    ]);

    return file;
  }

  // replace space to underscore
  private fileNameGenerator = (originalName: string, extension: string) => {
    const fileName = originalName
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "_")
      .replace(/^-+|-+$/g, "");

    return new Date().getTime().toString() + randomInt(11111111, 99999999).toString() + '_' + fileName + extension;
  };
}
