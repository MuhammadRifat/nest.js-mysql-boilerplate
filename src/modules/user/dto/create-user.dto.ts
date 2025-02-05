import { IsEmail, IsEnum, IsMobilePhone, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { USER_TYPE } from '../enum/user.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsMobilePhone()
  phone?: string;

  @IsNotEmpty()
  @IsEnum(USER_TYPE)
  role: USER_TYPE;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  image?: string;
}