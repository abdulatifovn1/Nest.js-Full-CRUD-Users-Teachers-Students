import { Injectable } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

@Injectable()
export class CreateTeacherDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  fullname!: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password! : string
}
