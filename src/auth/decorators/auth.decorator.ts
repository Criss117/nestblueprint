import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export const Auth = () => {
  return applyDecorators(UseGuards(AuthGuard()));
};
