/* eslint-disable react/no-array-index-key */
import React, { useMemo, useCallback } from 'react';

import classNames from 'classnames';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import useModal from 'hooks/useModal';

const InterviewField = ({
  sectionName,
  value,
  subFields,
  name,
  index,
  conflictValue,
  hasConflict,
  paths,
  token,
  refetchConflicts,
  clientId,
  interviewId,
}) => {
  const { open } = useModal('MERGE_CONFLICT_FIELD');

  const handleOpenModal = useCallback(() => {
    open({
      value,
      conflictValue,
      name,
      paths,
      token,
      refetchConflicts,
      clientId,
      interviewId,
    });
  }, [value, conflictValue, name, open, paths, token, refetchConflicts, clientId, interviewId]);

  const tooltipMessage = useMemo(() => {
    const section = sectionName?.toLowerCase()?.replace(':', '');
    const field = name?.toLowerCase()?.replace(/(:|\?)/g, '');

    return `Conflict with the "${field}" in the ${section}. Click to merge anyway.`;
  }, [sectionName, name]);

  if (!value && !subFields && !conflictValue) return null;

  if (Array.isArray(subFields)) {
    return (
      <div className='field sub-field' key={name}>
        {subFields?.map((subField, i) => (
          <InterviewField
            {...subField}
            sectionName={name}
            token={token}
            refetchConflicts={refetchConflicts}
            key={subField.name + i}
          />
        ))}
      </div>
    );
  }

  return (
    <div key={name + index} className='field'>
      {name && <span className='field-name'>{name}</span>}
      {hasConflict ? (
        <OverlayTrigger
          placement='right'
          overlay={
            <Tooltip id='tooltip-top' show={false}>
              <span>{tooltipMessage}</span>
            </Tooltip>
          }
        >
          <span
            className={classNames('field-value', { error: hasConflict, 'no-name': !name })}
            onClick={handleOpenModal}
          >
            {conflictValue || value}
          </span>
        </OverlayTrigger>
      ) : (
        <span className={classNames('field-value', { error: hasConflict, 'no-name': !name })}>
          {value || conflictValue}
        </span>
      )}
    </div>
  );
};

export default InterviewField;
