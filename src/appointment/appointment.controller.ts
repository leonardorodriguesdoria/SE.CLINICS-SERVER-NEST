import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  UseFilters,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto, StatusExam } from './dto/create-appointment.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { User } from 'src/utils/customdecorators/user-decorator';
import { AppointmentNotFoundExceptionFilter } from 'src/utils/customExceptions/filters/appointmentNotFoundExceptionFilter';

@Controller('appointment')
@UseFilters(AppointmentNotFoundExceptionFilter)
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @UseGuards(AuthGuard)
  @Post('register')
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.createNewAppointment(createAppointmentDto);
  }

  @UseGuards(AuthGuard)
  @Patch(':id/confirm')
  async confirmAppointment(@Param('id', ParseIntPipe) id: number) {
    const confirmedAppointment =
      await this.appointmentService.updateAppointmentStatus(
        id,
        StatusExam.CONFIRMED,
      );
    return { message: 'Consulta confirmada com sucesso', confirmedAppointment };
  }

  @UseGuards(AuthGuard)
  @Patch(':id/cancel')
  async cancelAppointment(
    @Param('id', ParseIntPipe) id: number,
    @Body('explanation') professionalExplanation: string,
  ) {
    const cancelAppointment =
      await this.appointmentService.updateAppointmentStatus(
        id,
        StatusExam.CANCELED,
        professionalExplanation,
      );
    return { message: 'Consulta cancelada com sucesso', cancelAppointment };
  }

  @UseGuards(AuthGuard)
  @Patch(':id/done')
  async markAppointmentAsDone(@Param('id', ParseIntPipe) id: number) {
    const markAppointmentAsDone =
      await this.appointmentService.updateAppointmentStatus(
        id,
        StatusExam.DONE,
      );
    return {
      message: 'Consulta marcada como realizada!!!',
      markAppointmentAsDone,
    };
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  @Post('photo')
  async uploadPhoto(@User() user, @UploadedFile() photo: Express.Multer.File) {
    const uploadResult = await writeFile(
      join(
        __dirname,
        '..',
        '..',
        'storage',
        'symptoms_photos',
        `photo-${user.id}.png`,
      ),
      photo.buffer,
    );
    return { uploadResult };
  }
}
