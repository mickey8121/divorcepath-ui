import React, { memo } from 'react';

import Modal from 'components/common/Modal';

import LocationForm from 'components/organization/location/LocationForm';

const MODAL_NAME = 'EDIT_LOCATION';

const CreateTagModal = () => (
  <Modal
    autoFocus={false}
    size='md'
    name={MODAL_NAME}
    form={MODAL_NAME}
    title='Edit location'
    borderedHeader={false}
    submitButtonTitle='Save'
    showCloseButton
  >
    <LocationForm formId={MODAL_NAME} type='EDIT' />
  </Modal>
);

export default memo(CreateTagModal);
