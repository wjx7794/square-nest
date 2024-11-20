import { IsEmail, IsNotEmpty, IsNumberString } from 'class-validator';

export class LoginUserDTO {
  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  password: string;
}
