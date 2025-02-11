import { IsEmpty, IsJWT, IsString, IsStrongPassword } from 'class-validator';

export class ResetUserAuthDTO {
  @IsString()
  @IsEmpty()
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

  @IsJWT()
  @IsEmpty()
  token: string;
}
