import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { JwtStrategy } from '../guards/jwt.strategy';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { environment } from '../env/envoriment';

@Module({
  imports: [],
  controllers: [AdminController],
  providers: [
    AdminService,
    JwtStrategy,
    JwtService,
    {
      provide: 'dbclient',
      useClass: PrismaClient,
    },
    {
      provide: JwtService,
      useFactory: () => new JwtService(),
    },
  ],
})
export class AdminModule {}
