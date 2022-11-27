import React, { useCallback, useMemo } from 'react';

import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import AuthPage from 'layout/AuthPage';

import Button from 'components/common/Button';

import Biography from 'components/ClientProfile/Biography';

import useCurrentUser from 'hooks/useCurrentUser';

import UPDATE_CLIENT from 'graphql/mutations/clients/updateClient';

const ConfirmAccount = () => {
  const [updateClient, { loading }] = useMutation(UPDATE_CLIENT);

  const { me } = useCurrentUser();

  const { push } = useHistory();

  const savedData = useMemo(
    () => JSON.parse(localStorage.getItem('SPOUSAL') || localStorage.getItem('CHILD') || ''),
    [],
  );

  // ensure this page is only accessible to users with incomplete profiles
  const clientProfileName = useMemo(() => me?.client?.profile?.firstName, [me]);
  const proProfileName = useMemo(() => me?.professional?.profile?.firstName, [me]);
  if (
    (clientProfileName && clientProfileName !== ('You' || 'Client')) ||
    (proProfileName && proProfileName !== ('You' || 'Client'))
  ) {
    push('/');
  } else if (
    (clientProfileName && clientProfileName === ('You' || 'Client')) ||
    (proProfileName && proProfileName === ('You' || 'Client'))
  ) {
    push('/complete-account');
  }

  const clientData = useMemo(
    () => ({
      children: [...(savedData?.children?.create || [])],
      profile: {
        firstName: savedData?.clientSupportProfile?.create?.firstName,
        lastName: savedData?.clientSupportProfile?.create?.lastName || '',
        gender: savedData?.clientSupportProfile?.create?.gender || null,
        birthDate: savedData?.clientSupportProfile?.create?.birthDate || null,
      },
      exProfile: {
        firstName: savedData?.exSupportProfile?.create?.firstName,
        lastName: savedData?.exSupportProfile?.create?.lastName || '',
        gender: savedData?.exSupportProfile?.create?.gender || null,
        birthDate: savedData?.exSupportProfile?.create?.birthDate || null,
      },
      relationship: {
        ...(savedData?.relationship?.create || {}),
      },
      address: {
        residence: savedData?.clientSupportProfile?.create?.residence,
      },
      exAddress: {
        residence: savedData?.exSupportProfile?.create?.residence,
      },
    }),
    [savedData],
  );

  const handleSubmitForm = useCallback(() => {
    const variables = {
      data: {
        profile: {
          update: {
            ...clientData.profile,
          },
        },
        exProfile: {
          update: {
            ...clientData.exProfile,
          },
        },
        relationship: { update: { ...clientData.relationship } },
        children: { create: clientData.children || undefined },
        address: {
          update: {
            ...clientData.address,
          },
        },
        exAddress: {
          update: {
            ...clientData.exAddress,
          },
        },
      },
      where: {
        id: me.client?.id || me.professional?.id,
      },
    };

    updateClient({ variables })
      .then(() => {
        localStorage.removeItem('SPOUSAL');
        localStorage.removeItem('CHILD');

        toast.success('Profile completed');
        push('/complete-account');
      })
      .catch(err => err.graphQLErrors.map(({ message }) => toast.error(message)));
  }, [me, updateClient, clientData, push]);

  const handleWrongClick = useCallback(() => push('/complete-account'), [push]);

  return (
    <AuthPage isCard={false}>
      <div className='card confirm-account-card mb-0'>
        <div className='card-body'>
          <div className='text-center mb-3'>
            <h6 className='h3'>Confirm profile data</h6>
            <p className='text-muted mb-0'>Find your path.</p>
          </div>

          <Biography client={clientData} />

          <div className='buttons'>
            <Button disabled={loading} onClick={handleWrongClick} color='secondary'>
              No, I have changes
            </Button>
            <Button disabled={loading} onClick={handleSubmitForm}>
              Yes that’s correct
            </Button>
          </div>
        </div>
      </div>
    </AuthPage>
  );
};

export default ConfirmAccount;
