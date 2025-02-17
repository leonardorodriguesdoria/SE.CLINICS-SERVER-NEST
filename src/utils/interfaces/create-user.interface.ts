import { UserRole } from 'src/auth/dto/create-auth.dto';

export interface ICreateUser {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly role: UserRole;
  readonly birthDate?: string; // Alterado para string (ISO 8601)
  readonly healthPlan?: string;
  readonly specialization?: string;
  readonly clinicsId?: number[]; // Garantindo imutabilidade
}
