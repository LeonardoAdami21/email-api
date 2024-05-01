import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';

@Controller('admin')
@ApiTags('Admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'Register a new admin' })
  @ApiCreatedResponse({ description: 'Admin registered successfully' })
  @ApiConflictResponse({ description: 'Admin already exists' })
  @Post('/register')
  register(@Body() dto: RegisterAdminDto) {
    return this.adminService.register(dto);
  }

  @ApiOperation({ summary: 'Login a admin' })
  @ApiCreatedResponse({ description: 'Admin logged in successfully' })
  @ApiConflictResponse({ description: 'Admin already exists' })
  @Post('/login')
  login(@Body() dto: LoginAdminDto) {
    return this.adminService.login(dto);
  }
}
