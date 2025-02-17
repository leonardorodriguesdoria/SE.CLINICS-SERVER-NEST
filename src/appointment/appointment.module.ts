import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Patient } from 'src/patient/entities/patient.entity';
import { Clinic } from 'src/clinic/entities/clinic.entity';
import { Professional } from 'src/professional/entities/professional.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, Patient, Clinic, Professional]),
    AuthModule,
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
