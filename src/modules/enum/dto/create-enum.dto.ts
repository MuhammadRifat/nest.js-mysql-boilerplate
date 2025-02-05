import { IsNotEmpty, IsString } from "class-validator";

export class CreateEnumDto {
    @IsNotEmpty()
    @IsString()
    key: string;

    @IsNotEmpty()
    value: object;
}
