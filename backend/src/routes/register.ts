import bcrypt from 'bcrypt';
import { Middleware } from 'koa';
import * as yup from 'yup';
import db from '../db';
import { createJWT } from '../lib/helpers';
import logger from '../lib/logger';
import { emailValidator, firstNameValidator, lastNameValidator, passwordValidator, phoneNumberValidator } from '../validation/user';

const registerValidator = yup.object({
  email: emailValidator,
  password: passwordValidator,
  firstName: firstNameValidator,
  lastName: lastNameValidator,
  phoneNumber: phoneNumberValidator,
});

const register: Middleware = async (ctx) => {
  logger.continueDebug('validating register request...');
  const params = await registerValidator.validate(ctx.request.body);

  logger.continueDebug('checking if email already exists...');
  const email = await db.first('email').from('user').where({ email: params.email });

  if (email != null) {
    logger.continueWarn('email already exists!');
    ctx.status = 409;
    return;
  }

  logger.continueDebug('hashing password...');
  const password = await bcrypt.hash(params.password, await bcrypt.genSalt());

  logger.continueDebug('inserting user...');
  const [userId] = await db.insert({ ...params, password }).into('user').returning('user_id');

  logger.continueDebug('generating jwt...');
  const token = createJWT(userId);

  ctx.status = 201;
  ctx.cookies.set('jwt', token, { httpOnly: true, sameSite: true });
};

export default register;
