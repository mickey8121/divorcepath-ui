import React, { useCallback } from 'react';

import { toast } from 'react-toastify';

import CreatableSelect from 'components/common/inputs/Select/CreatableSelect';

import { LEGAL_ISSUE } from 'components/clients/legalIssue/LegalIssueModal';
import LegalIssueOption from 'components/clients/legalIssue/legalIssueSelect/LegalIssueOption';
import LegalIssueMultiValue from 'components/clients/legalIssue/legalIssueSelect/LegalIssueMultiValue';

import useModal from 'hooks/useModal';
import useLegalIssuesContext from 'hooks/issues/useLegalIssuesContext';

const LEGAL_ISSUE_FIELD = 'legalIssue';

const LegalIssueSelect = () => {
  const { open, close } = useModal(LEGAL_ISSUE);
  const { options, handleCreateIssue, loading } = useLegalIssuesContext();

  const onCreate = useCallback(
    name =>
      new Promise(resolve => {
        open({
          onSubmitClick: issueValues => {
            if (loading) return toast.info('Please wait creating');

            close();

            resolve(true);

            handleCreateIssue(issueValues);
          },
          onCancelClick: () => resolve(false),
          name,
        });
      }),
    [close, handleCreateIssue, loading, open],
  );

  return (
    <CreatableSelect
      components={{
        Option: LegalIssueOption,
        MultiValue: LegalIssueMultiValue,
      }}
      isMulti
      name={LEGAL_ISSUE_FIELD}
      placeholder='Legal issues (optional)'
      options={options}
      closeMenuOnSelect={false}
      onCreate={onCreate}
      openMenuOnFocus
    />
  );
};

export default LegalIssueSelect;
