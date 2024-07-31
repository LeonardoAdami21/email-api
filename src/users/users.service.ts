import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { environment } from '../env/envoriment';
import { JwtStrategy } from '../guards/jwt.strategy';
import { ChangePasswordDTo } from './dto/change-password.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/updade-user.dto';
import { UserRepositoryInterface } from './prisma/user.repositoy.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly usersRepository: UserRepositoryInterface,
    private readonly jwtStrategy: JwtStrategy,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterUserDto) {
    const { name, email, password, role } = dto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    const users = await this.usersRepository.create({
      ...dto,
      password: hashedPassword,
      role: role || UserRole.USER,
      passwordConfirmation: hashedPassword,
      confirmationToken: confirmationToken,
      recoverToken: null,
    });
    if (dto.password !== dto.passwordConfirmation) {
      throw new ConflictException('Password confirmation is incorrect');
    }
    return users;
  }

  async login(dto: LoginUserDto) {
    const { email, password } = dto;
    const user = await this.usersRepository.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('Email not found');
    }
    if (user == null) {
      throw new UnauthorizedException('Credentials not valid');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ConflictException('Passwords not match');
    }
    const payload = await this.jwtStrategy.validate(user);
    const token = this.jwtService.sign(payload, {
      secret: environment.jwtSecret,
      expiresIn: '1d',
    });
    return { access_token: token };
  }

  async findAll() {
    const users = await this.usersRepository.findAll();
    return users;
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { name, email, role } = dto;
    user.name = name;
    user.email = email;
    user.role = role ? role : user.role;
    try {
      await this.usersRepository.update(id, dto);
      return {
        message: 'User updated successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException('Error updating user');
    }
  }

  async remove(id: number) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    try {
      await this.usersRepository.delete(id);
      return {
        message: 'User removed successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException('Error removing user');
    }
  }

  async confirmEmail(confirmationToken: string) {
    const user = await this.usersRepository.confirmEmail(confirmationToken);
    if (!user) {
      throw new NotFoundException('Confirmation token not found');
    }
    return await this.usersRepository.updateConfirmationToken(
      user.id,
      confirmationToken,
    );
  }

  async sendRecoveryPasswordEmail(email: string): Promise<any> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const recoverToken = (user.recoverToken = crypto
      .randomBytes(32)
      .toString('hex'));
    await this.usersRepository.sendRecoveryPasswordEmail(email, recoverToken);

  }

  async resetPassword(
    recoverToken: string,
    changePasswordDto: ChangePasswordDTo,
  ) {
    const user = await this.usersRepository.findByRecoverToken(recoverToken);
    if (!user) {
      throw new NotFoundException('Recover token not found');
    }
    try {
      await this.changePassword(user.id, changePasswordDto);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async changePassword(id: number, dto: ChangePasswordDTo) {
    const { password, passwordConfirmation } = dto;
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (password !== passwordConfirmation) {
      throw new UnprocessableEntityException('Password dosent matches');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    return await this.usersRepository.changePassword(id, hashedPassword);
  }
}
