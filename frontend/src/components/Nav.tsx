import { Link } from '@reach/router';
import classnames from 'classnames';
import React from 'react';
import { useStoreActions, useStoreState } from '../store';

const isActive = ({ isCurrent }: { isCurrent: boolean }): object => ({ className: classnames('px-4 py-2 rounded-full mr-2 ml-2 sm:ml-0', { 'bg-blue-500 hover:bg-blue-600 text-white': isCurrent, 'bg-gray-400 hover:bg-gray-500 text-black': !isCurrent }) });

const Nav: React.FC = () => {
  const isLoggedIn = useStoreState((store) => !!store.user.user.email);
  const logoutUser = useStoreActions((actions) => actions.user.logoutUser);

  if (!isLoggedIn) {
    return <></>;
  }

  return (
    <div className="flex justify-between mt-4 mb-6 min-w-xs">
      <div>
        <Link to="/" getProps={isActive}>Home</Link>
        <Link to="/profile" getProps={isActive}>Profile</Link>
      </div>
      <div>
        <button className="mr-2 sm:mr-0 hover:underline" type="button" onClick={(): unknown => logoutUser()}>Log out</button>
      </div>
    </div>
  );
};

export default Nav;
