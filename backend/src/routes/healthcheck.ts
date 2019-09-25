import { Middleware } from 'koa';
import db from '../db';
import logger from '../lib/logger';

const healthcheck: Middleware = async (ctx) => {
  logger.continueDebug('pinging db...');
  await db.raw('select 1;');
  ctx.status = 200;
};

export default healthcheck;
