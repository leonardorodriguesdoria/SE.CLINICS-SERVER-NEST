import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UserRole } from './dto/create-auth.dto';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword } from 'src/utils/hashPassword';
import { Patient } from 'src/patient/entities/patient.entity';
import { Professional } from 'src/professional/entities/professional.entity';
import { ICreateUser } from 'src/utils/interfaces/create-user.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Professional)
    private readonly professionalRepository: Repository<Professional>,
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
}
