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

const databasePort = process.env.DB_PORT as unknown as number | undefined;

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: databasePort,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    }),
    AuthModule,
    ProfessionalModule,
    PatientModule,
    AppointmentModule,
    ClinicModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
