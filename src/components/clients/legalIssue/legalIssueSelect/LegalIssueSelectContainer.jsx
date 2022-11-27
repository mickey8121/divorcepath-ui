import React from 'react';

import LegalIssueSelect from 'components/clients/legalIssue/legalIssueSelect/LegalIssueSelect';

import LegalIssuesContextProvider from 'context/LegalIssuesContext/LegalIssuesContextProvider';

const LegalIssueSelectContainer = () => (
  <LegalIssuesContextProvider>
    <LegalIssueSelect />
  </LegalIssuesContextProvider>
);

export default LegalIssueSelectContainer;
