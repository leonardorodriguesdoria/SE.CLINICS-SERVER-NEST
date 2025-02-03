import { Appointment } from 'src/appointment/entities/appointment.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('patient')
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  birthDate: Date;

  @Column()
  healthPlan: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];
}
