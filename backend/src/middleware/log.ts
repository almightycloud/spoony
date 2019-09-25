import { Middleware } from 'koa';
import logger from '../lib/logger';

const log: Middleware = async (ctx, next) => {
  logger.beginDebug(ctx.path);

  const start = Date.now();
  await next();
  const finished = Date.now() - start;

  logger.continueDebug(`finished in ${finished}ms`);
};

export default log;
