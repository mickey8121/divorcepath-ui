import React, { useMemo } from 'react';

import { Link } from 'react-router-dom';

import Notification from 'components/common/Notification';
import Button from 'components/common/Button';

import Biography from 'components/ClientProfile/Biography';

import useModal from 'hooks/useModal';

import getCompleteProfilePercent from 'utils/getCompleteProfilePercent';

const ProfileDetails = ({ client, isShow }) => {
  const { open } = useModal('CREATE_INTERVIEW');

  const { id, profile, profileProgress: clientProfileProgress } = useMemo(() => client, [client]);

  const profileProgress = useMemo(
    () => getCompleteProfilePercent(clientProfileProgress),
    [clientProfileProgress],
  );

  if (!isShow) return null;

  return (
    <div className='clients-bio-container'>
      {profileProgress < 80 && (
        <Notification
          body={
            <p className='default-notification-text'>
              Profile is incomplete. Consider sending an&nbsp;
              <Button color='link' size='sm' onClick={() => open({ client })} className='noty-btn'>
                interview
              </Button>
              .
            </p>
          }
          name='incomplete-profile'
          className='py-2'
          footer
        />
      )}

      <Biography client={client} />

      {profileProgress < 80 && (
        <Notification
          body={
            <p className='default-notification-text'>
              Complete {profile?.firstName || 'client'}'s profile to see additional information
              here.
            </p>
          }
          name='complete-profile'
          className='py-2'
          footer
        />
      )}

      <div className='text-sm profile-links'>
        <Button
          tag={Link}
          to={{
            pathname: `/clients/${id}/edit/background`,
            state: { fromClientList: true },
          }}
          color='link'
          size='sm'
          rightIcon='edit'
        >
          Edit Profile
        </Button>
      </div>
    </div>
  );
};

export default ProfileDetails;
