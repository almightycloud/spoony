/* eslint-disable import/first */
require('dotenv').config();

import Koa from 'koa';
import bodyPaser from 'koa-bodyparser';
import compress from 'koa-compress';
import helmet from 'koa-helmet';
import errorHandler from './middleware/error-handler';
import log from './middleware/log';
import router from './routes';

const port = parseInt(process.env.PORT || '3001', 10);
const app = new Koa();

app.use(log);
app.use(helmet());
app.use(compress());
app.use(bodyPaser());
app.use(errorHandler);
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(port);
