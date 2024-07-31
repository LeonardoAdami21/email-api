
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { JwtStrategy } from '../guards/jwt.strategy';
import { UserRepository } from './prisma/user.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    JwtStrategy,
    JwtService,
    {
      provide: 'dbclient',
      useClass: PrismaClient,
    },
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    {
      provide: JwtService,
      useFactory: () => new JwtService(),
    },
  ],
})
export class UsersModule {}
