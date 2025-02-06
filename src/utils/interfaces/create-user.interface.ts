import { UserRole } from 'src/auth/dto/create-auth.dto';

export interface ICreateUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  birthDate?: Date;
  healthPlan?: string;
  specialization?: string;
  clinics?: string[];
}
