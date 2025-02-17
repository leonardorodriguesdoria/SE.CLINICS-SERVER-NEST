import { Clinic } from 'src/clinic/entities/clinic.entity';
import { Patient } from 'src/patient/entities/patient.entity';
import { Professional } from 'src/professional/entities/professional.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string;

  @Column()
  clinicalExam: string;

  @Column()
  patientDescription: string;

  @Column({ nullable: true })
  professionalExplanation: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  imagePath: string;

  @ManyToOne(() => Patient, (patient) => patient.appointments)
  @JoinColumn()
  patient: Patient;

  @ManyToOne(() => Professional, (professional) => professional.appointments)
  @JoinColumn()
  professional: Professional;

  @ManyToOne(() => Clinic, (clinic) => clinic.appointments)
  @JoinColumn()
  clinic: Clinic;
}
