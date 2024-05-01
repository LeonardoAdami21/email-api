import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChangePasswordDTo {
  @ApiProperty({
    example: '123456789',
    description: 'The new password',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: '123456789',
    description: 'The new confirmation password',
  })
  @IsNotEmpty()
  passwordConfirmation: string;
}
