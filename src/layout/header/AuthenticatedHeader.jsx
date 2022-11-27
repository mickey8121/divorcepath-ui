import React, { useMemo } from 'react';

import UserAccountDropdown from 'components/common/header/UserAccountDropdown';

import useCurrentUser from 'hooks/useCurrentUser';
import usePathToProfile from 'hooks/usePathToProfile';

import getUserName from 'utils/getUserName';

const AuthenticatedNavigation = () => {
  const { me, logout } = useCurrentUser();
  const pathToProfile = usePathToProfile();

  const userName = useMemo(() => getUserName(me), [me]);

  return (
    <ul className='navbar-nav align-items-lg-center ml-lg-auto'>
      <UserAccountDropdown userName={userName} pathToProfile={pathToProfile} logout={logout} />
    </ul>
  );
};

export default AuthenticatedNavigation;
