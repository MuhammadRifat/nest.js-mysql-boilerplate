import { Module } from '@nestjs/common';
import { FileLibraryController } from './file-library.controller';
import { S3Service } from '../s3/s3.service';
import { FileLibraryService } from './file-library.service';

@Module({
  controllers: [FileLibraryController],
  providers: [FileLibraryService, S3Service],
})
export class FileLibraryModule { }
