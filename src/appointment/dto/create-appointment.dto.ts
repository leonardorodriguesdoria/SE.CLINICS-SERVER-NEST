import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';

export enum StatusExam {
  REQUESTED = 'Solicitada',
  CONFIRMED = 'Confirmada',
  CANCELED = 'Cancelada',
  DONE = 'Realizada',
}

export class CreateAppointmentDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  clinicalExam: string;

  @IsString()
  @IsNotEmpty()
  patientDescription: string;

  @IsOptional()
  @IsString()
  imagePath?: string;

  @IsNumber()
  @IsNotEmpty()
  patient: number;

  @IsNumber()
  @IsNotEmpty()
  professional: number;

  @IsNumber()
  @IsNotEmpty()
  clinic: number;

  @IsOptional()
  @IsEnum(StatusExam)
  status?: StatusExam;
}
