import React, { memo } from 'react';

import Modal from 'components/common/Modal';

import JurisdictionForm from 'components/ProProfile/forms/jurisdictions/JurisdictionForm';

const MODAL_NAME = 'CREATE_JURISDICTION';

const CreateJurisdictionModal = () => (
  <Modal
    autoFocus={false}
    size='md'
    name={MODAL_NAME}
    form={MODAL_NAME}
    title='Create new jurisdiction'
    borderedHeader={false}
    submitButtonTitle='Create'
    showCloseButton
  >
    <JurisdictionForm formId={MODAL_NAME} type='CREATE' />
  </Modal>
);

export default memo(CreateJurisdictionModal);
