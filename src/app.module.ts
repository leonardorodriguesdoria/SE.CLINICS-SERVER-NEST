import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfessionalModule } from './professional/professional.module';
import { AppointmentModule } from './appointment/appointment.module';
import { ClinicModule } from './clinic/clinic.module';

@Module({
  imports: [AuthModule, UsersModule, ProfessionalModule, AppointmentModule, ClinicModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
