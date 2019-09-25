/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { createStore, createTypedHooks } from 'easy-peasy';
import model, { StoreModel } from './model';

export const { useStoreActions, useStoreDispatch, useStoreState } = createTypedHooks<StoreModel>();

const store = createStore(model);

if (process.env.NODE_ENV === 'development') {
  // @ts-ignore
  if (module.hot) {
    // @ts-ignore
    module.hot.accept('./model', () => {
      store.reconfigure(model);
    });
  }
}

export default store;
