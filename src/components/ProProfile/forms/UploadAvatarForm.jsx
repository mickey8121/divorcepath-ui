import React, { useMemo } from 'react';

import AvatarSelector from 'components/ClientProfile/AvatarSelector';

import useCurrentUser from 'hooks/useCurrentUser';

const UploadAvatarForm = () => {
  const { me } = useCurrentUser();

  const user = useMemo(() => me, [me]);

  const { profile: proProfile } = user?.professional || {};

  const userData = useMemo(
    () => ({
      proAvatar: proProfile?.avatarUrl,
    }),
    [proProfile?.avatarUrl],
  );

  const isPro = useMemo(() => user?.professional?.id, [user]);

  const userId = useMemo(() => user?.professional?.id, [user]);

  return (
    <div className='update-form profile-photo-form'>
      <div className='inputs-container'>
        <div className='left-side'>
          <h4 className='title'>Profile Photo</h4>
          <p className='subtitle'>
            The uploaded image must be at least 200x200 in size and the height must not exceed the
            width.
          </p>
          <p className='subtitle'>
            <span className='text-danger'>*</span> required for public profile
          </p>
        </div>

        <div className='right-side'>
          <AvatarSelector
            avatar={userData.proAvatar}
            isPro={isPro}
            id={userId}
            className='profile-avatar-selector'
            width='200'
            height='200'
            profilePhotoPro
          />
        </div>
      </div>
    </div>
  );
};

export default UploadAvatarForm;
