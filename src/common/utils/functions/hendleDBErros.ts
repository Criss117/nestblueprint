import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { MYSQL_ERRORS } from '../enums';

export function heandleDBErros(error: any, entity: string): never {
  const logger = new Logger(entity);
  if (Object.values(MYSQL_ERRORS).includes(error.errno)) {
    throw new BadRequestException({
      message: error.sqlMessage,
      error: Object.keys(MYSQL_ERRORS).find(
        (key) => MYSQL_ERRORS[key] === error.errno,
      ),
      errorCode: error.errno,
      statusCode: 400,
    });
  }
  logger.log(error);
  throw new InternalServerErrorException('please check server logs');
}
