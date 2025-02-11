import { IsEmail, IsEmpty, IsString } from 'class-validator';

export class ForgetUserAuthDTO {
  @IsString()
  @IsEmpty()
  email: string;
}
