import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from './dto/create-auth.dto';
import { DataSource, In, QueryFailedError, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { comparePassword, hashPassword } from 'src/utils/hashPassword';
import { Patient } from 'src/patient/entities/patient.entity';
import { Professional } from 'src/professional/entities/professional.entity';
import { ICreateUser } from 'src/utils/interfaces/create-user.interface';
import { IUserLogin } from 'src/utils/interfaces/login-user.interface';
import { JwtService } from '@nestjs/jwt';
import { IResetUserPassword } from 'src/utils/interfaces/reset-password-user.interface';
import { Clinic } from 'src/clinic/entities/clinic.entity';

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
    @InjectRepository(Clinic)
    private readonly clinicRepository: Repository<Clinic>,

    private readonly dataSource: DataSource,
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
        clinicsId,
      } = createUser;

      let userAlreadyExists = await this.userRepository.findOne({
        where: { email },
      });

      if (userAlreadyExists) {
        throw new ConflictException(
          'Já existe um usuário cadastrado com este e-mail.',
        );
      }

      let hashedPassword = await hashPassword(password);

      return await this.dataSource.transaction(async (manager) => {
        let user = manager.getRepository(User).create({
          name,
          email,
          password: hashedPassword,
          role,
        });

        await manager.getRepository(User).save(user);

        if (role === UserRole.PATIENT) {
          if (!birthDate || !healthPlan) {
            throw new BadRequestException(
              'Data de nascimento e plano de saúde são obrigatórios para pacientes.',
            );
          }

          let patient = manager.getRepository(Patient).create({
            birthDate,
            healthPlan,
            user,
          });

          await manager.getRepository(Patient).save(patient);
        } else if (role === UserRole.PROFESSIONAL) {
          if (!specialization || !clinicsId || clinicsId.length === 0) {
            throw new BadRequestException(
              'Especialização e clínicas são obrigatórias para profissionais da saúde.',
            );
          }

          // Buscando as clínicas associadas pelos IDs
          const clinics = await manager.getRepository(Clinic).find({
            where: { id: In(clinicsId) }, // Usando 'In' para buscar todas as clínicas de uma vez
          });

          if (clinics.length !== clinicsId.length) {
            throw new BadRequestException(
              'Algumas clínicas fornecidas não existem.',
            );
          }

          let professional = manager.getRepository(Professional).create({
            specialization,
            clinics, // Associa as clínicas corretamente
            user, // Associando o usuário ao profissional
          });

          await manager.getRepository(Professional).save(professional);
        }

        return this.createToken(user);
      });
    } catch (error) {
      console.error(error);

      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        throw new InternalServerErrorException(
          'Erro ao processar o banco de dados.',
        );
      }

      throw new InternalServerErrorException(
        'Erro interno no sistema. Por favor tente mais tarde.',
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
