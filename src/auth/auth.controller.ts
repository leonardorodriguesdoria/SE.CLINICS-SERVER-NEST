import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserAuthDTO } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async create(@Body() createUserAuthDTO: CreateUserAuthDTO) {
    const user = await this.authService.registerUser(createUserAuthDTO);
    return { message: 'Usuário cadastrado com sucesso!!!', user };
  }
}
