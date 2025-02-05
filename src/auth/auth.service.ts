import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserAuthDTO } from './dto/create-auth.dto';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword } from 'src/utils/hashPassword';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  //Register User
  async registerUser(createAuthDto: CreateUserAuthDTO): Promise<User> {
    const { name, email, password, role } = createAuthDto;

    let patientAlreadyExists = await this.userRepository.findOne({
      where: { email },
    });
    if (patientAlreadyExists) {
      throw new ConflictException(
        'Já existe um usuário com esse e-mail. Por favor, informe outro e-mail',
      );
    }
    let hashedPassword = await hashPassword(password);
    let newPatient = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await this.userRepository.save(newPatient);

    return newPatient;
  }
}
