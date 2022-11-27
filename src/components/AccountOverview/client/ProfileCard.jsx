import React from 'react';

import ProfileHeader from 'components/ClientProfile/ProfileHeader';
import BiographyCollapse from 'components/AccountOverview/client/BiographyCollapse';

const ProfileCard = () => {
  return (
    <div className='profile-card'>
      <div className='profile-card-header'>
        <ProfileHeader />
      </div>
      <div className='profile-card-body'>
        <BiographyCollapse />
      </div>
    </div>
  );
};

export default ProfileCard;
