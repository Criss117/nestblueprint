import { IsString, Length } from 'class-validator';

export class ConfirmAccountDto {
  @IsString()
  @Length(20)
  token: string;
}
