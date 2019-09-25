import Router from '@koa/router';
import authenticate from '../middleware/authenticate';
import healthcheck from './healthcheck';
import login from './login';
import logout from './logout';
import register from './register';
import self from './self';

const router = new Router();

router.get('/api/v1/healthcheck', healthcheck);
router.post('/api/v1/login', login);
router.post('/api/v1/register', register);
router.get('/api/v1/self', authenticate, self);
router.post('/api/v1/logout', authenticate, logout);

export default router;
