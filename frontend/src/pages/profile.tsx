import { Redirect } from '@reach/router';
import React from 'react';
import createLogger from '../lib/logger';
import { useStoreState } from '../store';

const logger = createLogger('profile');

const Profile: React.FC = () => {
  const user = useStoreState((store) => store.user.user);

  if (!user.email) {
    logger.log('user not logged in, redirecting to /login.');
    return <Redirect to="/login" noThrow />;
  }

  return (
    <div className="mt-16 mx-auto rounded max-w-sm p-8 bg-white">
      <h1 className="text-xl mb-2">
        {user.firstName}
        {' '}
        {user.lastName}
      </h1>

      <dl className="flex w-full">
        <dt className="mr-4 w-1/5 text-right">Email: </dt>
        <dd className="w-5/6">{user.email}</dd>
      </dl>

      <dl className="flex w-full">
        <dt className="mr-4 w-1/5 text-right">Phone: </dt>
        <dd className="w-5/6">{user.phoneNumber}</dd>
      </dl>
    </div>
  );
};

export default Profile;
