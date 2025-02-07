import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PatientModule } from './patient/patient.module';
import { ProfessionalModule } from './professional/professional.module';
import { AppointmentModule } from './appointment/appointment.module';
import { ClinicModule } from './clinic/clinic.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { Patient } from './patient/entities/patient.entity';
import { Professional } from './professional/entities/professional.entity';
import { Appointment } from './appointment/entities/appointment.entity';
import { Clinic } from './clinic/entities/clinic.entity';
import { User } from './users/entities/user.entity';

const databasePort = process.env.DB_PORT as unknown as number | undefined;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: databasePort,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [Patient, Professional, Appointment, Clinic, User],
      synchronize: true,
    }),
    AuthModule,
    ProfessionalModule,
    PatientModule,
    AppointmentModule,
    ClinicModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
