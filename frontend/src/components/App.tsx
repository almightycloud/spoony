import { Router } from '@reach/router';
import { Store, StoreProvider } from 'easy-peasy';
import React from 'react';
import { hot } from 'react-hot-loader';
import Home from '../pages';
import Login from '../pages/login';
import Profile from '../pages/profile';
import Register from '../pages/register';
import { StoreModel } from '../store/model';
import Nav from './Nav';

const App: React.FC<{ store: Store<StoreModel> }> = ({ store }) => (
  <StoreProvider store={store}>
    <Nav />
    <Router>
      <Home path="/" />
      <Login path="/login" />
      <Register path="/register" />
      <Profile path="/profile" />
    </Router>
  </StoreProvider>
);

export default hot(module)(App);
