import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient, Users } from '@prisma/client';
import { RegisterUserDto } from '../dto/register-user.dto';
import { UpdateUserDto } from '../dto/updade-user.dto';
import { UserRepositoryInterface } from './user.repositoy.interface';
import * as crypto from 'crypto';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(@Inject('dbclient') private readonly dbClienbt: PrismaClient) {}

  private readonly usersRepository = this.dbClienbt.users;

  async create(dto: RegisterUserDto): Promise<Users> {
    return await this.usersRepository.create({
      data: dto,
    });
  }

  async findAll(): Promise<Users[]> {
    return await this.usersRepository.findMany();
  }

  async findById(id: number): Promise<Users> {
    const user = await this.usersRepository.findFirst({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: number, dto: UpdateUserDto): Promise<Users> {
    const user = await this.usersRepository.findFirst({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { name, email, role } = dto;
    user.name = name;
    user.email = email;
    user.role = role ? role : user.role;
    try {
      await this.usersRepository.update({
        where: {
          id: id,
        },
        data: user,
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error updating user');
    }
  }

  async changePassword(id: number, password: string): Promise<Users> {
    const user = await this.usersRepository.findFirst({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.password = password;
    try {
      await this.usersRepository.update({
        where: {
          id: id,
        },
        data: user,
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error updating user');
    }
  }

  async findByEmail(email: string): Promise<Users> {
    return await this.usersRepository.findFirst({
      where: {
        email: email,
      },
    });
  }

  async findByRecoverToken(recoverToken: string): Promise<Users> {
    return await this.usersRepository.findFirst({
      where: {
        recoverToken: recoverToken,
      },
    });
  }

  async confirmEmail(confirmationToken: string): Promise<any> {
    return await this.usersRepository.findFirst({
      where: {
        confirmationToken: confirmationToken,
      },
    });
  }

  async sendRecoveryPasswordEmail(email: string): Promise<any> {
    const user = await this.usersRepository.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const recoverToken = (user.recoverToken = crypto
      .randomBytes(32)
      .toString('hex'));
    await this.usersRepository.update({
      where: {
        id: user.id,
      },
      data: {
        recoverToken: recoverToken,
      },
    });
  }

  async delete(id: number): Promise<Users> {
    const user = await this.usersRepository.findFirst({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    try {
      await this.usersRepository.delete({
        where: { id: id },
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error removing user');
    }
  }

  async updateConfirmationToken(id: number, confirmationToken: string) {
    return await this.usersRepository.update({
      where: {
        id: id,
      },
      data: {
        confirmationToken: confirmationToken,
      },
    });
  }
}
