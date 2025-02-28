import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Clinic } from './entities/clinic.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClinicService {
  constructor(
    @InjectRepository(Clinic) private clinicRepository: Repository<Clinic>,
  ) {}

  create(createClinicDto: CreateClinicDto) {
    return 'This action adds a new clinic';
  }

  getAllClinics() {
    try {
      const allClinics = this.clinicRepository.find();
      if (!allClinics) {
        throw new NotFoundException('Clínicas não encontradas');
      }
      return allClinics;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro interno no sistema por favor tente mais tarde',
      );
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} clinic`;
  }

  update(id: number, updateClinicDto: UpdateClinicDto) {
    return `This action updates a #${id} clinic`;
  }

  remove(id: number) {
    return `This action removes a #${id} clinic`;
  }
}
