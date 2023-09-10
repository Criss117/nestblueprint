import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, VerifyEmail, ChangeEmail } from './dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('confirm/:token')
  confirm(@Param('token') token: string) {
    return this.userService.confirm(token);
  }

  @Patch('change-email')
  changeEmail(@Body() user: ChangeEmail) {
    return this.userService.changeEmail(user);
  }

  @Patch('verify')
  verifyEmail(@Body() email: VerifyEmail) {
    return this.userService.verifyEmail(email);
  }

  @Get(':prm')
  @HttpCode(200)
  findOne(@Param('prm') prm: string) {
    return this.userService.findOne(prm);
  }
}
