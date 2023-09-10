import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, Length } from 'class-validator';

export class ChangeEmail extends PickType(CreateUserDto, ['email']) {
  @IsString()
  @IsOptional()
  @Length(20)
  token?: string;
}
