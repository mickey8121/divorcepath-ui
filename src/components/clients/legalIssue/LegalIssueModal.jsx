import React from 'react';

import Modal from 'components/common/Modal';

import LegalIssueForm from 'components/clients/legalIssue/LegalIssueForm';

export const LEGAL_ISSUE = 'LEGAL_ISSUE';

const LegalIssueModal = () => (
  <Modal
    size='md'
    name={LEGAL_ISSUE}
    form={LEGAL_ISSUE}
    cancelBtnTitle='Cancel'
    submitButtonTitle='Create'
  >
    <LegalIssueForm formId={LEGAL_ISSUE} />
  </Modal>
);

export default LegalIssueModal;
