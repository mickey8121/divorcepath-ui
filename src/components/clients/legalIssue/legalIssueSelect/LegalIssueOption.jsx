/* eslint-disable no-underscore-dangle */
import React, { Fragment, useCallback } from 'react';

import { components } from 'react-select';

import LegalIssueTooltip from 'components/clients/legalIssue/legalIssueSelect/LegalIssueTooltip';
import { LEGAL_ISSUE } from 'components/clients/legalIssue/LegalIssueModal';

import useModal from 'hooks/useModal';
import useLegalIssuesContext from 'hooks/issues/useLegalIssuesContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LegalIssueOption = ({ children, ...props }) => {
  const { open, close } = useModal(LEGAL_ISSUE);

  const { handleDeleteIssue, handleUpdateIssue } = useLegalIssuesContext();

  const handleEditButtonClick = useCallback(
    event => {
      event.stopPropagation();

      const { label, description, value } = props.data;

      return new Promise(resolve => {
        open({
          onSubmitClick: (issueValues, id) => {
            resolve(true);

            close();

            if (id) handleUpdateIssue(issueValues, id);
          },
          onCancelClick: () => resolve(false),
          name: label,
          description,
          id: value,
          customSubmitBtnText: 'Edit',
        });
      });
    },
    [close, handleUpdateIssue, open, props],
  );

  const onDelete = useCallback(
    event => {
      event.stopPropagation();

      handleDeleteIssue(props.data);
    },
    [handleDeleteIssue, props],
  );

  return (
    <components.Option {...props}>
      <LegalIssueTooltip
        description={props.data?.description}
        value={props.value}
        className='custom-option'
        show={props.data?.__isNew__ ? false : undefined}
      >
        <Fragment>
          <p className='option-text text-limit mb-0'>{children}</p>
          {!props.data?.__isNew__ && (
            <div className='btn-container align-items-center'>
              <button type='button' className='btn-option btn' onClick={handleEditButtonClick}>
                <FontAwesomeIcon icon='edit' />
              </button>

              <button type='button' className='btn-option btn' onClick={onDelete}>
                <FontAwesomeIcon icon='trash' />
              </button>
            </div>
          )}
        </Fragment>
      </LegalIssueTooltip>
    </components.Option>
  );
};

export default LegalIssueOption;
