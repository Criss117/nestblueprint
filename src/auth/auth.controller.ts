import { Response } from 'express';
import { Res, Get, Post, Body, HttpCode, Controller } from '@nestjs/common';

import { GetUser, Auth } from './decorators';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from '../user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(200)
  login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(loginUserDto, response);
  }

  @Get()
  @Auth()
  testingPrivateRoute(@GetUser() user: User) {
    return user;
  }
}
