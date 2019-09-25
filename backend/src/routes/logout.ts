import { Middleware } from 'koa';
import logger from '../lib/logger';

const logout: Middleware = async (ctx) => {
  logger.continueDebug('clearing jwt...');
  ctx.status = 200;
  ctx.cookies.set('jwt', '', { expires: new Date() });
};

export default logout;
