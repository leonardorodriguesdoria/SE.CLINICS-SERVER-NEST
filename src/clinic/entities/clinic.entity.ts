import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Professional } from 'src/professional/entities/professional.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Clinic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @ManyToMany(() => Professional, (professional) => professional.clinics)
  professionals: Professional[];

  @OneToMany(() => Appointment, (appointment) => appointment.clinic)
  appointments: Appointment[];
}
