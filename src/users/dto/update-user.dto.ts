import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdatUserDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;
}
