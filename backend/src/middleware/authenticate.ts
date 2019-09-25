import jwt from 'jsonwebtoken';
import { Middleware } from 'koa';
import logger from '../lib/logger';

const authenticate: Middleware = async (ctx, next) => {
  logger.continueDebug('retreiving jwt...');
  const token = ctx.cookies.get('jwt');

  if (!token) {
    logger.continueWarn('couldn\'t find jwt!');
    ctx.status = 401;
    return;
  }

  logger.continueDebug('verifying jwt...');
  ctx.claims = jwt.verify(token, process.env.JWT_SECRET as string);

  await next();
};

export default authenticate;
