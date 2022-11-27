import React, { Fragment, memo, useCallback } from 'react';

import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';

import Modal from 'components/common/Modal';

import useModal from 'hooks/useModal';

import CLIENT_FRAGMENT from 'graphql/fragments/client';
import DELETE_INTERVIEW from 'graphql/mutations/interview/deleteInterview';

const MODAL_NAME = 'DELETE_INTERVIEW';

const DeleteInterviewModal = () => {
  const { options } = useModal(MODAL_NAME);

  const [deleteInterview] = useMutation(DELETE_INTERVIEW);

  const { token, client } = options || {};

  const handleDeleteInterview = useCallback(async () => {
    try {
      await toast.promise(
        deleteInterview({
          variables: { where: { token } },
          update: (cache, { data }) => {
            let cacheClient;

            try {
              cacheClient = cache.readFragment({
                id: `Client:${client?.id}`,
                fragment: CLIENT_FRAGMENT,
                fragmentName: 'CLIENT_FRAGMENT',
              });
            } catch (error) {}

            if (cacheClient) {
              cache.writeFragment({
                id: `Client:${client?.id}`,
                fragment: CLIENT_FRAGMENT,
                fragmentName: 'CLIENT_FRAGMENT',
                data: {
                  ...client,
                  interviews: client?.interviews?.filter(
                    interview => data?.deleteIntakeInterview?.interview.token !== interview.token,
                  ),
                },
              });
            }
          },
        }),
        {
          pending: `Deleting intake interview...`,
          success: `Intake interview deleted`,
          error: `Something went wrong. Try again later`,
        },
      );

      close();
    } catch {}
  }, [client, deleteInterview, token]);

  return (
    <Modal
      autoFocus={false}
      size='md'
      name={MODAL_NAME}
      onSubmitClick={handleDeleteInterview}
      title='Delete interview'
      submitButtonTitle='Yes'
      cancelBtnTitle='No'
      className='delete-interview'
      showCloseButton
    >
      <Fragment>
        <div className='delete-interview-body'>
          <span className='description'>
            Do you really want to delete the interview without being able to restore it?
          </span>
        </div>
      </Fragment>
    </Modal>
  );
};

export default memo(DeleteInterviewModal);
