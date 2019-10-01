import { Middleware } from 'koa';
import db from '../db';
import logger from '../lib/logger';

const self: Middleware = async (ctx) => {
  logger.continueDebug('retreiving self...');
  const user = await db
    .first('email', 'first_name', 'last_name', 'phone_number')
    .from('user')
    .where({ userId: ctx.claims.sub });

  if (user == null) {
    logger.continueWarn('couldn\'t find self!');
    ctx.status = 404;
    return;
  }

  logger.continueDebug('formatting phone-number...');
  const phoneNumber = `${user.phoneNumber.substr(0, 3)}-${user.phoneNumber.substr(3, 3)}-${user.phoneNumber.substr(6, 4)}`;

  ctx.status = 200;
  ctx.body = { ...user, phoneNumber };
};

export default self;
