import { IsOptional, IsString } from "class-validator";
import { IPaginate } from "src/common/dtos/dto.common";

export class QueryUserDto extends IPaginate {
  @IsOptional()
  @IsString()
  search?: string;
}