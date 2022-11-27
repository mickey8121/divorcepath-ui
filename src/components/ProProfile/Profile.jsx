import React, { useMemo } from 'react';

import { useMutation } from '@apollo/client';

import BackgroundForm from 'components/ProProfile/forms/BackgroundForm';
import UsernameForm from 'components/ProProfile/forms/UsernameForm';
import GeneralInformationForm from 'components/ClientProfile/settingsForm/GeneralInformationForm';
import LocationSelect from 'components/organization/location/LocationSelect';
import DegreesAndJurisdictionsForm from 'components/ProProfile/forms/DegreesAndJurisdictionsForm';
import PublicProfileForm from 'components/ProProfile/forms/PublicProfileForm';
import SocialMedia from 'components/ProProfile/forms/SocialMedia';
import UploadAvatarForm from 'components/ProProfile/forms/UploadAvatarForm';
import ReviewsForm from 'components/ProProfile/forms/reviews/ReviewsForm';

import useCurrentUser from 'hooks/useCurrentUser';
import useOrganizationQuery from 'hooks/useOrganizationQuery';

import UPDATE_PROFESSIONAL from 'graphql/mutations/professional/updateProfessional';

const Profile = () => {
  const { me } = useCurrentUser();

  const [updateProfessional] = useMutation(UPDATE_PROFESSIONAL);

  const initialValues = useMemo(() => {
    const { phone, firstName, middleName, lastName } = me?.professional?.profile || {};

    return {
      id: me?.professional?.id,
      email: me?.email || '',
      profile: {
        phone: phone || '',
        first: firstName || '',
        middle: middleName || '',
        last: lastName || '',
      },
    };
  }, [me]);

  const { data } = useOrganizationQuery(me?.id);

  const organization = data?.organization;

  return (
    <div className='update-form-container'>
      <div className='update-form-header'>
        <h4>Your Profile</h4>
      </div>
      <div className='update-form-content'>
        <PublicProfileForm />
        <div className='divider' />
        <UsernameForm initialValues={initialValues} updateUser={updateProfessional} />
        <div className='divider' />
        <GeneralInformationForm initialValues={initialValues} updateUser={updateProfessional} />
        <div className='divider' />
        <ReviewsForm />
        <div className='divider' />
        <SocialMedia updateUser={updateProfessional} />
        <div className='divider' />
        <LocationSelect organizationId={organization?.id} locations={organization?.locations} />
        <div className='divider' />
        <BackgroundForm />
        <div className='divider' />
        <DegreesAndJurisdictionsForm />
        <div className='divider' />
        <UploadAvatarForm />
      </div>
    </div>
  );
};

export default Profile;
