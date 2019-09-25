import bcrypt from 'bcrypt';
import { Middleware } from 'koa';
import * as yup from 'yup';
import db from '../db';
import { createJWT } from '../lib/helpers';
import logger from '../lib/logger';
import { emailValidator, passwordValidator } from '../validation/user';

const loginValidator = yup.object({
  email: emailValidator,
  password: passwordValidator,
});

const login: Middleware = async (ctx) => {
  logger.continueDebug('validating login request...');
  const params = await loginValidator.validate(ctx.request.body);

  logger.continueDebug('finding user...');
  const user = await db.first('user_id', 'first_name', 'last_name', 'email', 'phone_number', 'password')
    .from('user')
    .where({ email: params.email });

  if (user == null) {
    logger.continueWarn('user does not exist!');
    ctx.status = 404;
    return;
  }

  logger.continueDebug('checking password...');
  const passwordIsSame = await bcrypt.compare(params.password, user.password);
  if (!passwordIsSame) {
    logger.continueWarn('incorrect password!');
    ctx.status = 404;
    return;
  }

  logger.continueDebug('generating jwt...');
  const token = createJWT(user.userId);

  ctx.status = 200;
  ctx.cookies.set('jwt', token, { httpOnly: true, sameSite: true });
  ctx.body = { ...user, userId: undefined, password: undefined };
};

export default login;
