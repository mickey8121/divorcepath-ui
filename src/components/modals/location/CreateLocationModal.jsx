import React, { memo } from 'react';

import Modal from 'components/common/Modal';

import LocationForm from 'components/organization/location/LocationForm';

const MODAL_NAME = 'CREATE_LOCATION';

const CreateTagModal = () => (
  <Modal
    autoFocus={false}
    size='md'
    name={MODAL_NAME}
    form={MODAL_NAME}
    title='Create new location'
    borderedHeader={false}
    submitButtonTitle='Create'
    showCloseButton
  >
    <LocationForm formId={MODAL_NAME} type='CREATE' />
  </Modal>
);

export default memo(CreateTagModal);
