import React, { useCallback } from 'react';

import { useApolloClient, useLazyQuery, useMutation } from '@apollo/client';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import Button from 'components/common/Button';

import useConfirm from 'hooks/useConfirm';

import CLIENTS from 'graphql/queries/client/paginatedClients';
import DELETE_CLIENT from 'graphql/mutations/clients/deleteClient';

const DeleteClient = ({ userId, clientId }) => {
  const apolloClient = useApolloClient();
  const history = useHistory();

  const [deleteClient] = useMutation(DELETE_CLIENT);
  const [refetchClients] = useLazyQuery(CLIENTS, {
    variables: { where: { NOT: { type: { equals: 'NOT_RETAINED' } } } },
  });

  const confirm = useConfirm({
    size: 'md',
    title: 'Delete client?',
    message: "All client's data will be erased. Client's username will be available to anyone.",
    negativeBtnLabel: 'No',
    positiveBtnLabel: 'Yes',
    reversedButtons: true,
  });

  const handleSubmit = useCallback(async () => {
    if (!(await confirm())) return;

    const variables = {
      where: {
        id: userId || clientId,
      },
    };

    deleteClient({
      variables,
      refetchQueries: ['clientsCount'],
    })
      .then(({ data }) => {
        refetchClients();

        const normalizedId = apolloClient.cache.identify({
          id: data.deleteClient?.id,
          __typename: 'Client',
        });

        setTimeout(() => {
          apolloClient.cache.evict({ id: normalizedId });
          apolloClient.cache.gc();
        }, 0);

        history.push('/clients');
      })
      .catch(err => err.graphQLErrors.map(({ message }) => toast.error(message)));
  }, [userId, clientId, deleteClient, history, confirm, apolloClient, refetchClients]);

  return (
    <div className='delimiter-top'>
      <OverlayTrigger
        overlay={
          <Tooltip id='tooltip-top'>
            <p>Deleting client's account is irreversible and can affect past activities.</p>
          </Tooltip>
        }
      >
        <Button id='delete-btn' size='md' color='danger' onClick={handleSubmit}>
          Delete client
        </Button>
      </OverlayTrigger>
    </div>
  );
};

export default DeleteClient;
