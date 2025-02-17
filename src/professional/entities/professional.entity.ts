import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Clinic } from 'src/clinic/entities/clinic.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Professional {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  specialization: string;

  @ManyToMany(() => Clinic, (clinic) => clinic.professionals)
  @JoinTable()
  clinics: Clinic[];

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToMany(() => Appointment, (appointment) => appointment.professional)
  appointments: Appointment[];
}
