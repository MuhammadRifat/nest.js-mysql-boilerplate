import { IsBoolean, IsEmail, IsEnum, IsMobilePhone, IsMongoId, IsNotEmpty, IsNumberString, IsOptional, IsString, isEnum } from "class-validator";

export class IPaginate {
    @IsOptional()
    @IsNumberString()
    limit?: number;

    @IsOptional()
    @IsNumberString()
    page?: number;
}


export class QueryCommonDto extends IPaginate {
    @IsOptional()
    @IsString()
    sortBy: string;

    @IsOptional()
    @IsNumberString()
    sortOrder: number;
}
