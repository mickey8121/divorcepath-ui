import React, { memo, useMemo } from 'react';

import Modal from 'components/common/Modal';

import useCurrentUser from 'hooks/useCurrentUser';

const MODAL_NAME = 'WARNING';

const WarningModal = () => {
  const { me } = useCurrentUser();

  const {
    email,
    professional: { biography, degree, jurisdiction, locations, profile, type } = {},
  } = me;

  const possibleErrors = useMemo(
    () => [
      {
        hasError: !profile?.firstName,
        title: 'First Name',
      },
      {
        hasError: !profile?.lastName,
        title: 'Last Name',
      },
      {
        hasError: !email,
        title: 'Email',
      },
      {
        hasError: !profile?.phone,
        title: 'Phone',
      },
      {
        hasError: !locations?.length,
        title: 'Location',
      },
      {
        hasError: !type,
        title: 'Professional Type',
      },
      {
        hasError: !biography,
        title: 'Biography',
      },
      {
        hasError: !degree?.length,
        title: 'Degree',
      },
      {
        hasError: !jurisdiction?.length,
        title: 'Jurisdiction',
      },
    ],
    [biography, degree, locations, type, profile, jurisdiction, email],
  );

  const errors = useMemo(
    () => possibleErrors.filter(error => error.hasError).map(error => error.title),
    [possibleErrors],
  );

  return (
    <Modal
      autoFocus={false}
      size='md'
      name={MODAL_NAME}
      title='Warning'
      borderedHeader={false}
      submitButtonTitle='Ok'
      className='warning-modal'
      showCloseButton
      hideCancel
    >
      <div className='errors-to-fill'>
        <span className='title'>
          The following required {errors?.length > 1 ? 'fields' : 'field'} must be completed:
        </span>
        <span className='errors'>{errors.join(', ')}</span>
      </div>
    </Modal>
  );
};

export default memo(WarningModal);
