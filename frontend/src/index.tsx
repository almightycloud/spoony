import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import createLogger from './lib/logger';
import * as serviceWorker from './lib/serviceWorker';
import store from './store';
import './styles/index.css';

const logger = createLogger('main');

async function main(): Promise<void> {
  try {
    logger.begin('attempting to automatically log in user');

    const url = '/api/v1/self';
    logger.continue(`sending GET request to ${url}`);
    const response = await fetch(url);

    if (response.ok) {
      store.getActions().user.setUser(await response.json());
      logger.continue('logged in user.');
    } else if (response.status === 401) {
      logger.continue('unable to automatically log in user (missing or expired cookie)');
    } else {
      logger.continue('error while attempting to automatically log in user');
    }
  } catch (e) {
    logger.continue('network error while attempting to automatically log in user: %o', e);
  }

  logger.log('rendering <App />');
  ReactDOM.render(<App store={store} />, document.getElementById('root'));

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.register();
}

main();
