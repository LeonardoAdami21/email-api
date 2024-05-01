import {
  MAILER_OPTIONS,
  MailerModule,
  MailerService,
} from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { mailerConfig } from 'src/config/mailer.config';
import { JwtStrategy } from '../guards/jwt.strategy';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRepository } from './prisma/user.repository';
import { environment } from 'src/env/envoriment';
@Module({
  imports: [MailerModule.forRoot(mailerConfig)],
  controllers: [UsersController],
  providers: [
    UsersService,
    JwtStrategy,
    JwtService,
    MailerService,
    {
      provide: 'dbclient',
      useClass: PrismaClient,
    },
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    {
      provide: MAILER_OPTIONS,
      useValue: {
        transport: {
          host: environment.NODEMAILER_HOST,
          port: Number(environment.NODEMAILER_PORT),
          secure: false,
          auth: {
            user: environment.NODEMAILER_USER,
            pass: environment.NODEMAILER_PASS,
          },
        },
      },
    },
    {
      provide: JwtService,
      useFactory: () => new JwtService(),
    },
  ],
})
export class UsersModule {}
