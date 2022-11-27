import React, { memo } from 'react';

import Modal from 'components/common/Modal';

import DegreeForm from 'components/ProProfile/forms/degree/DegreeForm';

const MODAL_NAME = 'CREATE_DEGREE';

const CreateDegreeModal = () => (
  <Modal
    autoFocus={false}
    size='md'
    name={MODAL_NAME}
    form={MODAL_NAME}
    title='Create new degree'
    borderedHeader={false}
    submitButtonTitle='Create'
    showCloseButton
  >
    <DegreeForm formId={MODAL_NAME} type='CREATE' />
  </Modal>
);

export default memo(CreateDegreeModal);
