import React from 'react';

import { components } from 'react-select';

import LegalIssueTooltip from 'components/clients/legalIssue/legalIssueSelect/LegalIssueTooltip';

const LegalIssueMultiValue = ({ children, ...props }) => (
  <components.MultiValue {...props}>
    <LegalIssueTooltip
      description={props.data?.description}
      value={props.value}
      className='custom-multi-value'
    >
      {children}
    </LegalIssueTooltip>
  </components.MultiValue>
);

export default LegalIssueMultiValue;
