import React, { memo } from 'react';

import Modal from 'components/common/Modal';

import InviteForm from 'components/organization/members/InviteForm';

const MODAL_NAME = 'INVITE_MEMBER';

const InviteModal = () => {
  return (
    <Modal
      autoFocus={false}
      size='md'
      name={MODAL_NAME}
      form={MODAL_NAME}
      title='Invite organization member'
      borderedHeader={false}
      submitButtonTitle='Send invitation'
      showCloseButton
    >
      <InviteForm formId={MODAL_NAME} />
    </Modal>
  );
};

export default memo(InviteModal);
