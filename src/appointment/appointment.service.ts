import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ICreateAppointment } from 'src/utils/interfaces/create-appointment.interface';
import { Patient } from 'src/patient/entities/patient.entity';
import { Clinic } from 'src/clinic/entities/clinic.entity';
import { Professional } from 'src/professional/entities/professional.entity';
import { StatusExam } from './dto/create-appointment.dto';
import { AppointmentNotFoundException } from 'src/utils/customExceptions/appointmentNotFoundException';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Clinic)
    private readonly clinicRepository: Repository<Clinic>,
    @InjectRepository(Professional)
    private readonly professionalRepository: Repository<Professional>,
  ) {}

  async createNewAppointment(appointment: ICreateAppointment) {
    try {
      const {
        date,
        clinicalExam,
        patientDescription,
        imagePath,
        patient: patientId,
        professional: professionalId,
        clinic: clinicId,
      } = appointment;

      const patient = await this.patientRepository.findOne({
        where: {
          id: patientId,
        },
      });

      const professional = await this.professionalRepository.findOne({
        where: {
          id: professionalId,
        },
      });

      const clinic = await this.clinicRepository.findOne({
        where: {
          id: clinicId,
        },
      });

      if (!patient || !professional || !clinic) {
        throw new AppointmentNotFoundException(
          'Paciente, médico ou clínica não encontrados!!!',
        );
      }

      const newAppointment = this.appointmentRepository.create({
        date,
        clinicalExam,
        patientDescription,
        imagePath,
        status: StatusExam.REQUESTED,
        patient,
        professional,
        clinic,
      });

      await this.appointmentRepository.save(newAppointment);

      return newAppointment;
    } catch (error) {
      if (error instanceof AppointmentNotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Erro interno do sistema. Por favor tente mais tarde',
      );
    }
  }

  async updateAppointmentStatus(
    id: number,
    status: string,
    professionalExplanation?: string,
  ) {
    try {
      let appointment = await this.appointmentRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!appointment) {
        throw new NotFoundException('Consulta não encontrada!!!');
      }

      appointment.status = status;

      if (professionalExplanation) {
        appointment.professionalExplanation = professionalExplanation;
      }

      await this.appointmentRepository.save(appointment);

      return appointment;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Erro interno no sistema. Por favor tente mais tarde',
      );
    }
  }
}
