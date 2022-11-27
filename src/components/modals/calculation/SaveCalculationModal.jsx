import React, { memo } from 'react';

import { useHistory, useParams } from 'react-router';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';

import Modal from 'components/common/Modal';

import useModal from 'hooks/useModal';
import useCurrentUser from 'hooks/useCurrentUser';

import DUPLICATE_SUPPORT_CALCULATION from 'graphql/mutations/calculations/duplicateSupportCalculation';
import CHANGE_SHARE_SUPPORT_CALCULATION from 'graphql/mutations/calculations/changeShareSupportCalculation';
import SHARED_SUPPORT_CALCULATIONS from 'graphql/queries/calculations/sharedSupportCalculations';

const SaveCalculationModal = ({ client }) => {
  const { me } = useCurrentUser();
  const { calculationId } = useParams();
  const { push } = useHistory();

  const [deleteNotification] = useMutation(CHANGE_SHARE_SUPPORT_CALCULATION);
  const [duplicateSupportCalculation] = useMutation(DUPLICATE_SUPPORT_CALCULATION);

  const { open: createNewClient } = useModal('CREATE_NEW_CLIENT');

  const copyCalculation = e => {
    e.preventDefault();

    if (!client) {
      createNewClient({ calculationId });
    }

    if (client) {
      duplicateSupportCalculation({
        variables: {
          data: {
            supportCalculationId: calculationId,
            clientId: me?.professional ? client.id : undefined,
          },
        },
      }).then(() => {
        deleteNotification({
          variables: {
            data: {
              email: me.email,
              supportCalculationId: calculationId,
            },
          },
          update: cache => {
            try {
              const { sharedSupportCalculations } = cache.readQuery({
                query: SHARED_SUPPORT_CALCULATIONS,
              });

              cache.writeQuery({
                query: SHARED_SUPPORT_CALCULATIONS,
                data: {
                  sharedSupportCalculations: sharedSupportCalculations.filter(
                    sharedNotification => sharedNotification.id !== calculationId,
                  ),
                },
              });
            } catch (error) {
              toast.error(error.message);
            }
          },
        }).then(() => {
          push('/');
        });
      });
    }
  };

  return (
    <Modal
      autoFocus={false}
      size='md'
      name='SAVE_CALCULATION'
      borderedHeader={false}
      submitButtonTitle='Save Copy & Edit'
      cancelBtnTitle='Never mind'
      returnFocusAfterClose={false}
      onSubmitClick={copyCalculation}
    >
      <span>Shared calculations cannot be edited. Save a copy if you’d like to make changes</span>
    </Modal>
  );
};

export default memo(SaveCalculationModal);
