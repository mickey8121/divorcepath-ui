import React, { memo } from 'react';

import Modal from 'components/common/Modal';

import DegreeForm from 'components/ProProfile/forms/degree/DegreeForm';

const MODAL_NAME = 'EDIT_DEGREE';

const CreateDegreeModal = () => (
  <Modal
    autoFocus={false}
    size='md'
    name={MODAL_NAME}
    form={MODAL_NAME}
    title='Edit degree'
    borderedHeader={false}
    submitButtonTitle='Save'
    showCloseButton
  >
    <DegreeForm formId={MODAL_NAME} type='EDIT' />
  </Modal>
);

export default memo(CreateDegreeModal);
