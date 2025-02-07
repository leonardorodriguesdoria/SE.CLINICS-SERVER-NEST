import { IsEmail, IsEmpty, IsString } from 'class-validator';

export class LoginUserDTO {
  @IsEmail({}, { message: 'Insira um endereço de e-mail válido' })
  email: string;

  @IsString()
  password: string;
}
