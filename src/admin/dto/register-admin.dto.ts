import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsOptional } from 'class-validator';

export class RegisterAdminDto {
  @ApiProperty({
    example: 'Jhon Doe',
    type: String,
    description: 'The name of the User',
  })
  name: string;

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
  passwordConfirmation?: string;

  role?: UserRole;
}
