import React, { memo } from 'react';

import Modal from 'components/common/Modal';

import CreateInterviewForm from 'components/clients/card/CreateInterviewForm';

const MODAL_NAME = 'CREATE_INTERVIEW';

const CreateInterviewModal = () => (
  <Modal
    size='md'
    name={MODAL_NAME}
    form={MODAL_NAME}
    title='New Interview'
    submitButtonTitle='Confirm'
    className='create-interview'
    description='Client will be emailed a request to complete the interview and their answers will be merged with any empty profile fields.'
    showCloseButton
  >
    <CreateInterviewForm formId={MODAL_NAME} />
  </Modal>
);

export default memo(CreateInterviewModal);
