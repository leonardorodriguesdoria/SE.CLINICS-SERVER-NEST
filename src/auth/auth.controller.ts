import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserAuthDTO } from './dto/create-auth.dto';
import { LoginUserDTO } from './dto/login-auth.dto';
import { ForgetUserAuthDTO } from './dto/forget-user-auth.dto';
import { ResetUserAuthDTO } from './dto/reset-user-auth.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async create(@Body() createUserAuthDTO: CreateUserAuthDTO) {
    const user = await this.authService.registerUser(createUserAuthDTO);
    return { message: 'Usuário cadastrado com sucesso!!!', user };
  }

  @Post('login')
  async login(
    @Body() loginUserAuthDTO: LoginUserDTO,
    @Res() response: Response,
  ) {
    const { access_token } = await this.authService.userLogin(loginUserAuthDTO);
    response.cookie('access_token', access_token, {
      secure: true,
    });
    return response
      .status(HttpStatus.OK)
      .json({ message: 'Seja Bem vindo(a)' });
  }

  @UseGuards(AuthGuard)
  @Post('forget')
  async forget(@Body() forgetUserAuthDTO: ForgetUserAuthDTO) {
    const email = await this.authService.forget(forgetUserAuthDTO.email);
    return {
      message: 'Um e-mail foi enviado para redefinição de senha',
      email,
    };
  }
  @UseGuards(AuthGuard)
  @Post('reset')
  async reset(@Body() resetUserAuthDTO: ResetUserAuthDTO) {
    const resetPassword = await this.authService.reset(resetUserAuthDTO);
    return { message: 'Nova senha cadastrada com sucesso', resetPassword };
  }

  @UseGuards(AuthGuard)
  @Post('me')
  async me(@Req() request) {
    return { me: 'ok', data: request.tokenPayload };
  }
}
