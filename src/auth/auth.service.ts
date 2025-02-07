import {
  BadRequestException,
  ConflictException,
  Injectable,
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

@Injectable()
export class AuthService {
  private issuer = 'login';
  private audience = 'patients';
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Professional)
    private readonly professionalRepository: Repository<Professional>,
    private readonly jwtService: JwtService,
  ) {}

  //Register User
  async registerUser(createUser: ICreateUser): Promise<User> {
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
    return user;
  }

  async createToken(user: User) {
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

  async userLogin(body: IUserLogin) {
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

    const token = this.jwtService.sign(
      { id: user.id, email: user.email },
      {
        expiresIn: '3 days',
        subject: String(user.id),
        issuer: this.issuer,
        audience: this.audience,
      },
    );

    return { access_token: token };
  }
}
