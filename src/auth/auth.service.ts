import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { LoginUserDto } from './dto/login-user.dto';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { JwtPayLoad } from './interface/jwt-payload.interface';
import { userSelectTypes } from '../user/types/user-select.types';
import { verifyPassword } from '../common/utils/functions/hashpassword';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto, response: Response) {
    const { email, password } = loginUserDto;

    const select: userSelectTypes = {
      id: true,
      email: true,
      password: true,
      confirm: true,
    };

    const user = await this.userService.findOne(email, select);
    this.verifyUser(password, user);

    const jwt = this.generateJWT({ id: user.id });
    response.cookie(process.env.JWT_COOKIE_NAME, jwt);

    return { jwt };
  }

  private generateJWT(payload: JwtPayLoad) {
    const jwt = this.jwtService.sign(payload);
    return jwt;
  }

  private verifyUser(password: string, user: User) {
    if (!user) throw new UnauthorizedException('Email or password not valid');
    if (!user.confirm) throw new UnauthorizedException('User not confirmed');
    if (!verifyPassword(password, user.password))
      throw new UnauthorizedException('Email or password not valid');
  }
}
