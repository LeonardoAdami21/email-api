import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsEmail, IsOptional } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty()
  name: string;

  @IsEmail()
  @ApiProperty({
    example: 'jhondev@gmail.com',
    description: 'The email of the User',
  })
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'The password of the User',
  })
  password: string;

  @ApiProperty({
    example: '123456',
    description: 'The password confirmation of the User',
  })
  @IsOptional()
  passwordConfirmation: string;

  recoverToken?: null;
  confirmationToken?: string;
  role?: UserRole;
}
