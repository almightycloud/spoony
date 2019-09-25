import { Action, action, Thunk, thunk } from 'easy-peasy';
import HTTP_STATUS from '../lib/http-status';
import createLogger from '../lib/logger';
import { StoreModel } from './model';

const logger = createLogger('user');

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface UserModel {
  user: User;
  loginUser: Thunk<UserModel, { email: string; password: string }, {}, {}, Promise<HTTP_STATUS>>;
  registerUser: Thunk<UserModel, User & { password: string }, {}, {}, Promise<HTTP_STATUS>>;
  setUser: Action<UserModel, User>;
  logoutUser: Thunk<UserModel, undefined, {}, StoreModel, Promise<HTTP_STATUS>>;
  clearUser: Action<UserModel>;
}

const defaultUser = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
};

const userModel: UserModel = {
  user: defaultUser,
  loginUser: thunk(async (actions, credentials) => {
    try {
      logger.begin('logging in user');

      const url = '/api/v1/login';
      logger.continue(`sending POST request to ${url}`);
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        actions.setUser(await response.json());
        logger.continue('successfully logged in user!');
      } else {
        logger.continue('error while attempting to log in user: %s', response.statusText);
      }

      return response.status;
    } catch (e) {
      logger.continue('network error while attempting to log in user: %o', e);
      return HTTP_STATUS.NETWORK_ERROR;
    }
  }),
  registerUser: thunk(async (actions, newUser) => {
    try {
      logger.begin('registering user');

      const url = '/api/v1/register';
      logger.continue(`sending POST request to ${url}`);
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        logger.continue('successfully registered user!');
        const user = { ...newUser, password: undefined };
        actions.setUser(user);
      } else {
        logger.continue('error while attempting to register user');
      }

      return response.status;
    } catch (e) {
      logger.continue('network error while attempting to registering user: %o', e);
      return HTTP_STATUS.NETWORK_ERROR;
    }
  }),
  setUser: action((state, user) => {
    logger.continue('setting user: %o', user);
    state.user = user;
  }),
  logoutUser: thunk(async (actions, _, { getStoreActions }) => {
    logger.begin('logging user out');
    actions.clearUser();
    getStoreActions().todo.clearTodos();

    try {
      const url = '/api/v1/logout';
      logger.continue(`sending POST request to ${url}`);
      const response = await fetch(url, { method: 'POST' });

      if (response.ok) {
        logger.continue('cookie cleared.');
      } else {
        logger.continue('error clearing cookie!');
      }

      return response.status;
    } catch (e) {
      logger.continue('network error while attempting to clear cookie: %o', e);
      return HTTP_STATUS.NETWORK_ERROR;
    }
  }),
  clearUser: action((state) => {
    logger.continue('clearing user.');
    state.user = defaultUser;
  }),
};

export default userModel;
