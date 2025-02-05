import { PartialType } from '@nestjs/mapped-types';
import { CreateFileLibraryDto } from './create-file-library.dto';

export class UpdateFileLibraryDto extends PartialType(CreateFileLibraryDto) {}
