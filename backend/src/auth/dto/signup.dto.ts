import { IsEmail, IsString, MinLength } from 'class-validator';

/** Body for POST /auth/signup. Always creates an EMPLOYEE (no role field). */
export class SignupDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
