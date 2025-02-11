import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserAuthDTO } from './dto/create-auth.dto';
import { LoginUserDTO } from './dto/login-auth.dto';
import { ForgetUserAuthDTO } from './dto/forget-user-auth.dto';
import { ResetUserAuthDTO } from './dto/reset-user-auth.dto';

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

  @Post('forget')
  async forget(@Body() forgetUserAuthDTO: ForgetUserAuthDTO) {
    const email = await this.authService.forget(forgetUserAuthDTO.email);
    return {
      message: 'Um e-mail foi enviado para redefinição de senha',
      email,
    };
  }

  @Post('reset')
  async reset(@Body() resetUserAuthDTO: ResetUserAuthDTO) {
    const resetPassword = await this.authService.reset(resetUserAuthDTO);
    return { message: 'Nova senha cadastrada com sucesso', resetPassword };
  }
}
