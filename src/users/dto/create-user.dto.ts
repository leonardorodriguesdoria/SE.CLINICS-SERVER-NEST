import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsMagnetURI,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString({ message: 'Por favor, insira um nome válido' })
  @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
  @MaxLength(50, { message: 'O nome deve ter no máximo 50 caracteres' })
  name?: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Por favor, insira um endereço de email válido' })
  @MaxLength(100, { message: 'O e-mail deve ter no máximo 100 caracteres' })
  email?: string;

  @IsString()
  @IsNotEmpty()
  profilePicturePath?: string;
}
