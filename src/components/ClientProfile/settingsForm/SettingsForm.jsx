import React, { Fragment, useMemo } from 'react';

import { useMutation } from '@apollo/client';

import ChangePasswordForm from 'components/ClientProfile/settingsForm/ChangePasswordForm';
import GeneralInformationForm from 'components/ClientProfile/settingsForm/GeneralInformationForm';
import DeleteUser from 'components/ClientProfile/settingsForm/DeleteUser';

import useCurrentUser from 'hooks/useCurrentUser';

import UPDATE_CLIENT from 'graphql/mutations/clients/updateClient';
import UPDATE_PROFESSIONAL from 'graphql/mutations/professional/updateProfessional';

const SettingsForm = () => {
  const { me } = useCurrentUser();

  const [updateUser] = useMutation(UPDATE_CLIENT);
  const [updateProfessional] = useMutation(UPDATE_PROFESSIONAL);

  const isProfessional = useMemo(() => me?.professional?.id, [me]);
  const mutation = useMemo(
    () => (isProfessional ? updateProfessional : updateUser),
    [isProfessional, updateProfessional, updateUser],
  );
  const profileId = useMemo(
    () => (isProfessional ? me?.professional?.id : me?.client?.id),
    [isProfessional, me],
  );

  const initialValues = useMemo(
    () => ({
      id: profileId,
      email: me?.email || '',
      profile: {
        phone: me?.[isProfessional ? 'professional' : 'client']?.profile?.phone || '',
        first: me?.professional?.profile?.firstName || '',
        middle: me?.professional?.profile?.middleName || '',
        last: me?.professional?.profile?.lastName || '',
      },
    }),
    [profileId, me, isProfessional],
  );

  return (
    <div className='update-form-container settings-form'>
      <div className='update-form-header'>
        <h4>Account</h4>
      </div>

      <div className='update-form-content'>
        <ChangePasswordForm />

        {!isProfessional && (
          <Fragment>
            <div className='divider' />
            <GeneralInformationForm updateUser={mutation} initialValues={initialValues} />
          </Fragment>
        )}
        <div className='divider' />

        <DeleteUser />
      </div>
    </div>
  );
};

export default SettingsForm;
