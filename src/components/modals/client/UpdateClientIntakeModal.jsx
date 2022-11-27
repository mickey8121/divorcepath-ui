import React, { memo } from 'react';

import Modal from 'components/common/Modal';

import UpdateIntakeForm from 'components/clients/card/UpdateIntakeForm';

const MODAL_NAME = 'UPDATE_INTAKE';

const UpdateClientIntakeModal = () => (
  <Modal
    autoFocus={false}
    size='md'
    name={MODAL_NAME}
    form={MODAL_NAME}
    title='Client Intake'
    borderedHeader
    borderedFooter={false}
    submitButtonTitle='Confirm'
    className='update-intake'
    showCloseButton
  >
    <UpdateIntakeForm formId={MODAL_NAME} />
  </Modal>
);

export default memo(UpdateClientIntakeModal);
