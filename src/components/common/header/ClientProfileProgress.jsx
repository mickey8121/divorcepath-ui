import React, { useMemo } from 'react';

import { Link } from 'react-router-dom';

import useCurrentUser from 'hooks/useCurrentUser';

import getCompleteProfilePercent from 'utils/getCompleteProfilePercent';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ClientProfileProgress = () => {
  const { me } = useCurrentUser();
  const completeProfilePercent = useMemo(
    () => getCompleteProfilePercent(me.client?.profileProgress),
    [me],
  );

  return (
    <div className='profile-progress mb-0'>
      <span className='badge badge-dot text-white'>
        <i className='bg-green' />
        <Link to='/profile/background' className='text-white'>
          Your Profile
        </Link>
      </span>
      <span className='d-block h3 text-white font-weight-bold'>
        <Link to='/profile/background' className='text-white'>
          {completeProfilePercent}
          %&nbsp;
          <span className='font-weight-normal'>
            <FontAwesomeIcon icon='user-edit' />
          </span>
        </Link>
      </span>
    </div>
  );
};

export default ClientProfileProgress;
