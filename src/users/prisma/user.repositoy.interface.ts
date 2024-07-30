import { Users } from '@prisma/client';
import { RegisterUserDto } from '../dto/register-user.dto';
import { UpdateUserDto } from '../dto/updade-user.dto';

export interface UserRepositoryInterface {
  create(dto: RegisterUserDto): Promise<Users>;
  findAll(): Promise<Users[]>;
  findByEmail(email: string): Promise<Users>;
  findByRecoverToken(confirmationToken: string): Promise<Users>;
  confirmEmail(confirmationToken: string): Promise<any>;
  changePassword(id: number, password: string): Promise<Users>;
  updateConfirmationToken(
    id: number,
    confirmationToken: string,
  ): Promise<Users>;
  sendRecoveryPasswordEmail(email: string, recoverToken: string): Promise<any>;
  findById(id: number): Promise<Users>;
  update(id: number, dto: UpdateUserDto): Promise<Users>;
  delete(id: number): Promise<Users>;
}
