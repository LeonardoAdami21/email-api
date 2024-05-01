import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { Role } from '../guards/role.guard';
import { RolesGuard } from '../guards/role.strategy';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/updade-user.dto';
import { UsersService } from './users.service';
import { UserRole } from '@prisma/client';
import { ChangePasswordDTo } from './dto/change-password.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({summary: 'Register a new user'})
  @ApiCreatedResponse({description: 'User registered successfully'})
  @ApiConflictResponse({description: 'User already exists'})
  @Post('/register')
  register(@Body() dto: RegisterUserDto) {
    return this.usersService.register(dto);
  }

  @ApiOperation({
    summary: 'Login a user',
    responses: {
      200: { description: 'User logged in successfully' },
      401: { description: 'Unauthorized' },
    },
  })
  @Post('/login')
  login(@Body() dto: LoginUserDto) {
    return this.usersService.login(dto);
  }

  @ApiOperation({ summary: 'Send a Recovery password' })
  @ApiBearerAuth()
  @Post('/recovery-email')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.USER)
  @ApiBody({
    description: 'The recovery email',
    examples: {
      user: {
        value: {
          email: 'example@example.com',
        },
      },
    },
    type: String,
  })
  sendRecoveryPasswordEmail(@Body('email') email: string) {
    this.usersService.sendRecoveryPasswordEmail(email);
    return {
      message: 'Was send a email with instructions to reset your password.',
    };
  }

  @ApiOperation({ summary: 'Find all users' })
  @Get('/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ADMIN)
  async findAll() {
    return await this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Get user by id' })
  @Role(UserRole.ADMIN)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update user by id' })
  @Role(UserRole.USER)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Send a token to confirm your email' })
  @Role(UserRole.USER)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('token/:confirmationToken')
  async confirmationEmail(
    @Param('confirmationToken') confirmationToken: string,
  ) {
    await this.usersService.confirmEmail(confirmationToken);
    return {
      message: 'Email confirmation sent successfully.',
    };
  }

  @ApiOperation({ summary: 'Change Password' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.USER)
  @ApiBearerAuth()
  @Patch('reset-pasword/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() dto: ChangePasswordDTo,
  ) {
    console.log(token);
    await this.usersService.resetPassword(token, dto);
    return {
      message: 'Password changed successfully.',
    };
  }

  @ApiOperation({ summary: 'Delete user by id' })
  @Role(UserRole.ADMIN)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
