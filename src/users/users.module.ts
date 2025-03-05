import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Patient } from 'src/patient/entities/patient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Patient])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
