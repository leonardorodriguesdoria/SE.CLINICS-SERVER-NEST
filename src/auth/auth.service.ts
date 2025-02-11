import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from './dto/create-auth.dto';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { comparePassword, hashPassword } from 'src/utils/hashPassword';
import { Patient } from 'src/patient/entities/patient.entity';
import { Professional } from 'src/professional/entities/professional.entity';
import { ICreateUser } from 'src/utils/interfaces/create-user.interface';
import { IUserLogin } from 'src/utils/interfaces/login-user.interface';
import { JwtService } from '@nestjs/jwt';
import { IResetUserPassword } from 'src/utils/interfaces/reset-password-user.interface';

@Injectable()
export class AuthService {
  private issuer = 'login';
  private audience = 'users';
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Professional)
    private readonly professionalRepository: Repository<Professional>,
    private readonly jwtService: JwtService,
  ) {}

  createToken(user: User) {
    return {
      access_token: this.jwtService.sign(
        {
          name: user.name,
          email: user.email,
        },
        {
          expiresIn: '3 days',
          subject: String(user.id),
          issuer: this.issuer,
          audience: this.audience,
        },
      ),
    };
  }

  checkToken(token: string) {
    try {
      const data = this.jwtService.verify(token, {
        audience: this.audience,
        issuer: this.issuer,
      });
      return data;
    } catch (error) {
      throw new BadRequestException(
        'Ocorreu um erro na autenticação. Tente mais tarde',
      );
    }
  }

  isValidToken(token: string) {
    try {
      this.checkToken(token);
      return true;
    } catch (error) {
      return false;
    }
  }

  //Register User
  async registerUser(createUser: ICreateUser) {
    try {
      const {
        name,
        email,
        password,
        role,
        birthDate,
        healthPlan,
        specialization,
        clinics,
      } = createUser;

      let userAlreadyExists = await this.userRepository.findOne({
        where: { email },
      });

      if (userAlreadyExists) {
        throw new ConflictException(
          'Já existe um usuário cadastrado com este e-mail.',
        );
      }
      //Password hash
      let hashedPassword = await hashPassword(password);

      let user = this.userRepository.create({
        name,
        email,
        password: hashedPassword,
        role,
      });

      await this.userRepository.save(user);

      if (role === UserRole.PATIENT) {
        if (!birthDate || !healthPlan) {
          throw new BadRequestException(
            'Campos de data de nascimento e plano de saúde são obrigatórios para pacientes',
          );
        }

        let patient = this.patientRepository.create({
          birthDate,
          healthPlan,
          user,
        });

        await this.patientRepository.save(patient);
      } else if (role === UserRole.PROFESSIONAL) {
        if (!specialization || !clinics) {
          throw new BadRequestException(
            'Campos de especialização é obrigatório para profissionais da saúde',
          );
        }

        let professional = this.professionalRepository.create({
          specialization,
          clinics,
          user,
        });

        await this.professionalRepository.save(professional);
      }
      return this.createToken(user);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Erro interno no sistema. Por favor tente mais tarde',
      );
    }
  }

  async userLogin(body: IUserLogin) {
    try {
      const { email, password } = body;

      let user = await this.userRepository.findOne({
        where: {
          email: email,
        },
      });

      if (!user) {
        throw new UnauthorizedException('Email e/ou senhas inválidos');
      }

      const isPasswordValid = await comparePassword(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Email e/ou senhas inválidos');
      }

      return this.createToken(user);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Erro interno no sistema. Por favor tente mais tarde',
      );
    }
  }

  async forget(email: string) {
    try {
      let user = await this.userRepository.findOne({
        where: {
          email: email,
        },
      });
      if (!user) {
        throw new UnauthorizedException('Email inválido');
      }
      //TO DO: Enviar o e-mail
      return true;
    } catch (error) {
      throw new Error('Erro ao enviar e-mail');
    }
  }

  async reset(body: IResetUserPassword) {
    try {
      const id = 0;

      const result = await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({ password: body.password })
        .where('id = :id', { id })
        .returning('*')
        .execute();

      const updatedUser = result.raw[0];

      if (!updatedUser) {
        throw new UnauthorizedException(
          'Usuário não encontrado ou não atualizado.',
        );
      }

      return this.createToken(updatedUser);
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      throw new InternalServerErrorException(
        'Erro interno do sistema. Por favor tente novamente mais tarde',
      );
    }
  }
}
