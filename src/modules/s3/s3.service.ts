import { HttpException, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { IUploadFile } from './dto/s3.dto';

@Injectable()
export class S3Service {

    private AWS_S3_BUCKET: string;
    private s3: AWS.S3;

    constructor() {
        this.AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
        this.s3 = new AWS.S3({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY,
            secretAccessKey: process.env.AWS_S3_KEY_SECRET,
        });
    }

    // upload single file
    async uploadSingleFile(file: IUploadFile, directory: string) {
        try {
            const params = {
                Bucket: this.AWS_S3_BUCKET,
                Key: `${directory}/${file.fileName}`,
                Body: file.buffer,
                // ACL: 'public-read',
                // ContentType: file.mimetype,
                ContentDisposition: 'inline',
                CreateBucketConfiguration: {
                    LocationConstraint: process.env.AWS_S3_REGION,
                },
            };
            await this.s3.upload(params).promise();

            return file;
        } catch (error) {
            throw new Error(error);
        }
    }

    // multiple file uploaded
    async uploadMultipleFiles(files: IUploadFile[]) {
        try {
            // const uploadDirectory = 'chat';
            // const directory = uploadDirectory + '/' + 'media';
            const uploadedFiles = files.map(async (file) => {
                // const params = {
                //     Bucket: this.AWS_S3_BUCKET,
                //     Key: `${directory}/${file.fileName}`,
                //     Body: file.buffer,
                //     ACL: 'public-read',
                //     ContentType: file.mimetype,
                //     ContentDisposition: 'inline',
                //     CreateBucketConfiguration: {
                //         LocationConstraint: process.env.AWS_S3_REGION,
                //     },
                // };
                try {

                    // const data = await this.s3.upload(params).promise();
                    // console.log(data);
                    // upload on file system
                    const mainDirectory = join('public', 'uploads', file.fileName);
                    const data = await writeFile(mainDirectory, file.buffer);

                    return {
                        ...file,
                        // directory: uploadDirectory
                    }
                } catch (error) {
                    console.log(error.message);
                    throw new HttpException(error.message, error.status);
                }
            });

            return await Promise.all(uploadedFiles);
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    // delete file from s3 bucket
    async deleteFile(fileName: string, directory: string) {
        try {
            return await this.s3
                .deleteObject({
                    Bucket: this.AWS_S3_BUCKET,
                    Key: `${directory}/${fileName}`,
                })
                .promise();
        } catch (error) {
            throw new Error(error);
        }
    }
}