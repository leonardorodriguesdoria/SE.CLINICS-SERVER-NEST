import {
  IsString,
  IsEmail,
  IsStrongPassword,
  IsNotEmpty,
  IsEnum,
  MinLength,
  MaxLength,
} from 'class-validator';

export enum UserRole {
  PATIENT = 'paciente',
  PROFESSIONAL = 'profissional',
}

export class CreateUserAuthDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
  @MaxLength(50, { message: 'O nome deve ter no máximo 50 caracteres' })
  name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Por favor, insira um endereço de email válido' })
  @MaxLength(100, { message: 'O e-mail deve ter no máximo 100 caracteres' })
  email: string;

  @IsNotEmpty({ message: 'Senha deve ser obrigatória' })
  @IsStrongPassword(
    {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
    },
    {
      message:
        'A senha deve ter pelo menos 6 caracteres, incluindo: 1 letra maiúscula, 1 letra minúscula e 1 caractere especial',
    },
  )
  password: string;

  @IsNotEmpty({ message: 'O tipo de usuário é obrigatório' })
  @IsEnum(UserRole, {
    message:
      'Por favor, informe se você é um paciente ou um profissional da saúde',
  })
  role: UserRole;
}
