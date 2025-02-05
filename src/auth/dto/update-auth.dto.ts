import { PartialType } from '@nestjs/mapped-types';
import { CreateUserAuthDTO } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(CreateUserAuthDTO) {}
