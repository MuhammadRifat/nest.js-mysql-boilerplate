import { IsInt, IsOptional, IsString } from "class-validator";
import { IPaginate } from "src/common/dtos/dto.common";

export class QueryLogDto extends IPaginate {

    
    @IsOptional()
    @IsString()
    tableName: string;
    
    @IsOptional()
    @IsInt()
    recordId: number;
}
