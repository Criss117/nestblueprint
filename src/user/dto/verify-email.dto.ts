import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class VerifyEmail extends PickType(CreateUserDto, ['email']) {}
