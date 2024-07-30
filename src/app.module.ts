import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { WinstonModule } from 'nest-winston';
import { AdminModule } from './admin/admin.module';
import { winstonConfig } from './config/winston.config';
import { environment } from './env/envoriment';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WinstonModule.forRoot(winstonConfig),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: environment.jwtSecret,
      signOptions: { expiresIn: '1d' },
    }),
    UsersModule,
    AdminModule,
  ],
})
export class AppModule {}
