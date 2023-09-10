import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { JwtPayLoad } from '../interface/jwt-payload.interface';
import { userSelectTypes } from 'src/user/types/user-select.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET_KEY'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req) => req.cookies[configService.get('JWT_COOKIE_NAME')],
      ]),
    });
  }

  async validate(payload: JwtPayLoad): Promise<User> {
    const { id } = payload;
    const select: userSelectTypes = {
      id: true,
      name: true,
      email: true,
      confirm: true,
    };
    const user = await this.userService.findOne(id, select);

    if (!user) throw new UnauthorizedException('Token not valid');
    if (!user.confirm) throw new UnauthorizedException('User not confirmed');
    return user;
  }
}
