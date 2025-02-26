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
import { AppointmentNotFoundExceptionFilter } from 'src/utils/customExceptions/filters/appointmentNotFoundExceptionFilter';

@Controller('appointment')
@UseFilters(AppointmentNotFoundExceptionFilter)
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post('register')
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (image) {
      createAppointmentDto.imagePath = image.path;
    }

    const solicitedAppointment =
      this.appointmentService.createNewAppointment(createAppointmentDto);

    return {
      message: 'Consulta solicitada com sucesso!!!',
      solicitedAppointment,
    };
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
}
