import { Middleware } from 'koa';
import db from '../db';
import logger from '../lib/logger';

const self: Middleware = async (ctx) => {
  logger.continueDebug('retreiving self...');
  ctx.status = 200;
  ctx.body = await db
    .first('email', 'first_name', 'last_name', 'phone_number')
    .from('user')
    .where({ userId: ctx.claims.sub });
};

export default self;
