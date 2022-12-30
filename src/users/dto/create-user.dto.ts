import { IsEmail, IsString } from 'class-validator';

export class CreateUsersDto {
  @IsString()
  password: string;

  @IsEmail()
  email: string;
}
