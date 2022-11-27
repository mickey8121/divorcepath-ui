import React, { memo } from 'react';

import Modal from 'components/common/Modal';

import EditMemberForm from 'components/organization/members/EditMemberForm';

const MODAL_NAME = 'EDIT_MEMBER';

const EditMemberModal = () => (
  <Modal
    autoFocus={false}
    size='md'
    name={MODAL_NAME}
    form={MODAL_NAME}
    title='Edit organization member'
    borderedHeader={false}
    submitButtonTitle='Save'
    showCloseButton
  >
    <EditMemberForm formId={MODAL_NAME} />
  </Modal>
);

export default memo(EditMemberModal);
