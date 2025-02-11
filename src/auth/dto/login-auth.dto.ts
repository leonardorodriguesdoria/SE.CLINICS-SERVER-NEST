import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginUserDTO {
  @IsEmail({}, { message: 'Insira um endereço de e-mail válido' })
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
