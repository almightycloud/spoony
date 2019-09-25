import { JsonWebTokenError } from 'jsonwebtoken';
import { Middleware } from 'koa';
import { ValidationError } from 'yup';
import logger from '../lib/logger';

const errorHandler: Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    if (e instanceof ValidationError) {
      logger.continueWarn('validation error: %o', e);
      ctx.status = 400;
      ctx.body = e;
    } else if (e instanceof JsonWebTokenError) {
      logger.continueWarn('jwt is invalid: %o', e);
      ctx.status = 401;
    } else {
      logger.continueError('internal server error: %o', e);
      ctx.status = 500;
    }
  }
};

export default errorHandler;
