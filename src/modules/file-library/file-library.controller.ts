import { Controller, Get, Post, UseInterceptors, HttpException, Query, UploadedFiles, UseGuards, Req } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { IPaginate} from 'src/common/dtos/dto.common';
import { FileLibraryService } from './file-library.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('File Library')
@Controller('file-library')
export class FileLibraryController {
  constructor(private readonly fileLibraryService: FileLibraryService) { }

  @Post('image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @GetUser() user: User
  ) {
    try {
      const data = await this.fileLibraryService.uploadImages(files, user);

      return {
        success: true,
        data
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post('file')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @GetUser() user: User
  ) {
    try {
      const data = await this.fileLibraryService.uploadFiles(files, user);

      return {
        success: true,
        data
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query() paginate: IPaginate) {
    try {
      return await this.fileLibraryService.findAll(paginate);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  // @Get(':id')
  // @UseGuards(JwtAuthGuard)
  // async findOne(@Param() { id }: MongoIdParams) {
  //   try {
  //     const data = await this.fileLibraryService.findOne(id);

  //     return {
  //       success: true,
  //       data
  //     }
  //   } catch (error) {
  //     throw new HttpException(error.message, error.status);
  //   }
  // }

  // @Delete(':id')
  // @UseGuards(AdminAuthGuard)
  // async remove(@Param() { id }: MongoIdParams) {
  //   try {
  //     const data = await this.fileLibraryService.remove(id);

  //     return {
  //       success: true,
  //       data
  //     }
  //   } catch (error) {
  //     throw new HttpException(error.message, error.status);
  //   }
  // }
}