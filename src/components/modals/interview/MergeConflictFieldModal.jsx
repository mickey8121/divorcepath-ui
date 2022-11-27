import React, { Fragment, memo, useCallback } from 'react';

import { useApolloClient, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';

import Modal from 'components/common/Modal';

import useModal from 'hooks/useModal';
import useLazyQuery from 'hooks/useLazyQuery';

import MERGE_CONFLICTS from 'graphql/mutations/interview/mergeConflicts';
import CLIENT from 'graphql/queries/client/client';
import INTERVIEW_FRAGMENT from 'graphql/fragments/interview';

const MODAL_NAME = 'MERGE_CONFLICT_FIELD';

const MergeConflictFieldModal = () => {
  const { options } = useModal(MODAL_NAME);

  const {
    value,
    conflictValue,
    name,
    paths = [],
    token,
    refetchConflicts,
    clientId,
    interviewId,
  } = options || {};

  const [mergeConflicts] = useMutation(MERGE_CONFLICTS);
  const refetchClient = useLazyQuery(CLIENT);

  const apolloClient = useApolloClient();

  const handleSubmit = useCallback(async () => {
    try {
      const selected = paths.reduce((acc, path) => {
        const pathsArray = path.split('.');

        return {
          property: pathsArray[0],
          index: parseInt(pathsArray[1], 10) >= 0 ? parseInt(pathsArray[1], 10) : undefined,
          fields: [...(acc?.fields || []), pathsArray[2] || pathsArray[1]],
        };
      }, {});

      const toastId = toast.loading('Merging interview field with client profile...');

      await mergeConflicts({
        variables: { where: { token }, selected, mode: 'SELECTED' },
      });

      await refetchClient({ where: { id: clientId } }, 'network-only');
      await refetchConflicts();

      toast.dismiss(toastId);
      toast.success('Interview field merged successfully');

      try {
        const interviewFromCache = apolloClient.readFragment({
          id: `Interview:${interviewId}`,
          fragment: INTERVIEW_FRAGMENT,
          fragmentName: 'INTERVIEW_FRAGMENT',
        });

        apolloClient.writeFragment({
          id: `Interview:${interviewId}`,
          fragment: INTERVIEW_FRAGMENT,
          fragmentName: 'INTERVIEW_FRAGMENT',
          data: {
            ...interviewFromCache,
            mergedFields: interviewFromCache?.mergedFields + 1,
            conflictFields:
              interviewFromCache?.conflictFields <= 0 ? 0 : interviewFromCache?.conflictFields - 1,
          },
        });
      } catch {}

      close();
    } catch {
      toast.dismiss();
      toast.error('Something went wrong. Try again later');
    }
  }, [
    mergeConflicts,
    paths,
    token,
    refetchConflicts,
    clientId,
    refetchClient,
    apolloClient,
    interviewId,
  ]);

  return (
    <Modal
      autoFocus={false}
      size='sm'
      name={MODAL_NAME}
      title='Warning'
      borderedFooter={false}
      onSubmitClick={handleSubmit}
      submitButtonTitle='Yes'
      cancelBtnTitle='No, ignore'
      className='merge-conflict-field'
      showCloseButton
    >
      <Fragment>
        <div className='merge-conflict-info'>
          <div className='field'>
            <span className='title'>Profile</span>
            <p className='field-value-content'>
              <span className='field-name'>{name} </span>
              <span className='field-value'>{value || '-'}</span>
            </p>
          </div>
          <div className='field'>
            <span className='title'>Interview</span>
            <p className='field-value-content'>
              <span className='field-name'>{name} </span>
              <span className='field-value'>{conflictValue || '-'}</span>
            </p>
          </div>
          <p className='description'>
            Do you want to overwrite the profile field with the interview response?
          </p>
        </div>
      </Fragment>
    </Modal>
  );
};

export default memo(MergeConflictFieldModal);
