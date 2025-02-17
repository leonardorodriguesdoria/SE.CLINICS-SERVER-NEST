// src/utils/filters/appointment-not-found.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AppointmentNotFoundException } from '../appointmentNotFoundException';

@Catch(AppointmentNotFoundException)
export class AppointmentNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: AppointmentNotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.NOT_FOUND).json({
      statusCode: HttpStatus.NOT_FOUND,
      message: exception.message,
    });
  }
}
