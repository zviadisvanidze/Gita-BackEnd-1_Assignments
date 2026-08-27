import { IsEmail, IsIn, IsInt, IsNotEmpty, IsString, Min, MinLength } from 'class-validator';
import { Gender } from '../schemas/user.schema';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsIn(['male', 'female', 'other'])
  gender: Gender;

  @IsInt()
  @Min(0)
  age: number;
}
