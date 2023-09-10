import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsPositive, IsString, Length } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsPositive()
  id?: number;

  @IsString()
  @IsOptional()
  @Length(20)
  token?: string;
}
