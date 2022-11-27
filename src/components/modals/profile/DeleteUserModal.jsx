import React, { memo, useCallback } from 'react';

import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';

import Button from 'components/common/Button';
import Modal from 'components/common/Modal';

import useConfirm from 'hooks/useConfirm';
import useCurrentUser from 'hooks/useCurrentUser';
import useModal from 'hooks/useModal';

import REMOVE_USER from 'graphql/mutations/user/removeUser';

const MODAL_NAME = 'DELETE_USER';

const DeleteUserModal = ({ password }) => {
  const { me, logout } = useCurrentUser();

  const { close } = useModal('DELETE_USER');

  const [removeUser] = useMutation(REMOVE_USER);

  const confirm = useConfirm({
    title: 'Are you sure? This will permanently delete your account and all of its data.',
  });

  const handleSubmit = useCallback(async () => {
    if (await confirm()) {
      const variables = {
        where: {
          id: me.id,
          password,
        },
      };

      removeUser({ variables })
        .then(() => logout())
        .catch(err => err.graphQLErrors.map(({ message }) => toast.error(message)));
    }
  }, [confirm, logout, me.id, password, removeUser]);

  return (
    <Modal
      autoFocus={false}
      size='md'
      name={MODAL_NAME}
      form={MODAL_NAME}
      onCancelClick={handleSubmit}
      customOkBtn={
        <Button form={MODAL_NAME} color='primary' size='sm' type='submit' onClick={() => close()}>
          Not this time
        </Button>
      }
      cancelBtnTitle='Delete my account'
      title='Should we stop now?'
      description='All your data will be erased. You will no longer be billed, and your username will be available to anyone.'
    />
  );
};
export default memo(DeleteUserModal);
