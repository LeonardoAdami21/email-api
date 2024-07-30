import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { JwtStrategy } from '../guards/jwt.strategy';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import {
  MAILER_OPTIONS,
  MailerModule,
  MailerService,
} from '@nestjs-modules/mailer';
import { environment } from '../env/envoriment';
import { mailerConfig } from '../config/mailer.config';
@Module({
  imports: [MailerModule.forRoot(mailerConfig)],
  controllers: [AdminController],
  providers: [
    AdminService,
    JwtStrategy,
    JwtService,
    MailerService,
    {
      provide: 'dbclient',
      useClass: PrismaClient,
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
export class AdminModule {}
