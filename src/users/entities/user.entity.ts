import { Patient } from 'src/patient/entities/patient.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'https://ibb.co/27mgpNMx' })
  profilePicturePath: string;

  @Column({ default: 'paciente' })
  role: string;

  @OneToMany(() => Patient, (patient) => patient.user)
  patients: Patient[];
}
