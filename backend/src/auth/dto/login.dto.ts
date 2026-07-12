import { IsEmail, IsString } from 'class-validator';

/** Body for POST /auth/login. */
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
