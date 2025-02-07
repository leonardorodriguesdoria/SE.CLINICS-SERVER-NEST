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
import { LoginUserDTO } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async create(@Body() createUserAuthDTO: CreateUserAuthDTO) {
    const user = await this.authService.registerUser(createUserAuthDTO);
    return { message: 'Usuário cadastrado com sucesso!!!', user };
  }

  @Post('login')
  async login(@Body() loginUserAuthDTO: LoginUserDTO) {
    const user = await this.authService.userLogin(loginUserAuthDTO);
    return { message: 'Login efetuado com sucesso!!!', user };
  }
}
