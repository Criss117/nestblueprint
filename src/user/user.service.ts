import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import {
  generateToken,
  heandleDBErros,
  hashpassword,
  tokenExpired,
} from 'src/common/utils/functions';
import { User } from './entities/user.entity';
import { userSelectTypes } from './types/user-select.types';
import { ChangeEmail, CreateUserDto, VerifyEmail } from './dto';

@Injectable()
export class UserService {
  private readonly PATH = 'UserService';

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const newUser = this.userRepository.create({
        ...userData,
        token: generateToken(),
        password: hashpassword(password),
      });
      await this.userRepository.save(newUser);
      //TODO: send email

      return { message: 'User created successfully' };
    } catch (error) {
      // console.log(error);
      heandleDBErros(error, this.PATH);
    }
  }

  async confirm(token: string) {
    const user = await this.userRepository.findOne({
      where: { token },
    });

    if (!user) throw new BadRequestException('User not found');

    if (user.confirm)
      throw new ConflictException('The user is already confirmed');

    if (tokenExpired(user.tokenExpiration)) {
      await this.userRepository.remove(user);
      throw new UnauthorizedException(
        'Token has expired please create an account again',
      );
    }

    user.confirm = true;
    user.token = '';

    try {
      await this.userRepository.save(user);
      return { message: 'User confirmed successfully' };
    } catch (error) {
      heandleDBErros(error, this.PATH);
    }
  }

  async findOne(prm: number | string, select?: userSelectTypes) {
    if (!isNaN(+prm))
      return await this.userRepository.findOne({ where: { id: +prm }, select });

    if (typeof prm === 'string')
      return await this.userRepository.findOne({
        where: { email: prm },
        select,
      });

    throw new BadRequestException('Invalid parameter');
  }

  async verifyEmail(emailClient: VerifyEmail) {
    const user = await this.findOne(emailClient.email);

    if (!user) throw new NotFoundException('User not found');
    if (user.token.length > 0 && user.confirm)
      throw new ConflictException('The token has already been generated');

    user.token = generateToken();

    await this.userRepository.save(user);

    return {
      message: 'The email has been verified and token created correctly',
    };
  }

  async changeEmail(userData: ChangeEmail) {
    const newUser = await this.userRepository.findOneBy({
      token: userData.token,
    });

    if (!newUser) throw new BadRequestException('User not found');
    if (!newUser.confirm)
      throw new ConflictException('The user is not confirmed');

    if (tokenExpired(newUser.tokenExpiration))
      throw new UnauthorizedException('Token has expired');

    newUser.email = userData.email;
    newUser.token = '';

    try {
      await this.userRepository.save(newUser);
    } catch (error) {
      heandleDBErros(error, this.PATH);
    }
    return { message: 'Email updated successfully' };
  }
}
