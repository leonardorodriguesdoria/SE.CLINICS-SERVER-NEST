import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { IUpdateUser } from 'src/utils/interfaces/update-user.interface';
import { Patient } from 'src/patient/entities/patient.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Patient) private patientRepository: Repository<Patient>,
  ) {}

  findAll() {
    return `This action returns all users`;
  }

  async findUser(id: number) {
    try {
      let { password, ...user } = await this.userRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        `Erro ao identificar o usuário: ${error.message}`,
      );
    }
  }

  async update(id: number, updateUser: IUpdateUser) {
    try {
      let { name, email, profilePicturePath } = updateUser;

      let userExists = await this.userRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!userExists) {
        throw new NotFoundException('Usuário não encontrado');
      }

      await this.userRepository.update(id, {
        name,
        email,
        profilePicturePath,
      });
      let { password, ...updatedUser } = await this.userRepository.findOne({
        where: { id },
      });
      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException(
        `Erro ao atualizar o usuário: ${error.message}`,
      );
    }
  }

  async deleteUser(id: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['patients'],
      });
      // Verifica se o usuário existe
      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }
      // Desvincula os pacientes relacionados para quando for um médico excluindo sua conta
      if (user.patients && user.patients.length > 0) {
        user.patients.forEach((patient) => {
          patient.user = null; // Define a chave estrangeira como NULL
        });
        await this.patientRepository.save(user.patients);
      }
      await this.userRepository.remove(user);
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw new InternalServerErrorException(
        `Erro ao deletar o usuário: ${error.message}`,
      );
    }
  }
}
