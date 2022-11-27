import React, { memo } from 'react';

import Modal from 'components/common/Modal';

import JurisdictionForm from 'components/ProProfile/forms/jurisdictions/JurisdictionForm';

const MODAL_NAME = 'EDIT_JURISDICTION';

const EditJurisdictionModal = () => (
  <Modal
    autoFocus={false}
    size='md'
    name={MODAL_NAME}
    form={MODAL_NAME}
    title='Edit jurisdiction'
    borderedHeader={false}
    submitButtonTitle='Save'
    showCloseButton
  >
    <JurisdictionForm formId={MODAL_NAME} type='EDIT' />
  </Modal>
);

export default memo(EditJurisdictionModal);
