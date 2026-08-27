import { IsEmail, IsIn, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import type { Gender } from '../schemas/user.schema';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsInt()
  @Min(0)
  @Max(120)
  age: number;

  @IsIn(['m', 'f'])
  gender: Gender;

  @IsEmail()
  email: string;
}
