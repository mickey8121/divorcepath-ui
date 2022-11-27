import React, { useCallback, useMemo } from 'react';

import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import { startCase, capitalize } from 'lodash';
import { toast } from 'react-toastify';
import { Button, Badge, ListGroup, ListGroupItem } from 'reactstrap';

import REMOVE_ORGANIZATION_INVITE from 'graphql/mutations/organization/member/removeOrganizationInvite';
import ORGANIZATION_INVITES from 'graphql/queries/organization/organizationInvites';

import InviteForm from './members/InviteForm';

const Invitations = () => {
  const client = useApolloClient();

  const { data, refetch } = useQuery(ORGANIZATION_INVITES, {
    variables: { where: { status: { equals: 'PENDING' } } },
  });

  const invites = useMemo(() => data?.organizationInvites || [], [data]);

  const [removeOrganizationInvite] = useMutation(REMOVE_ORGANIZATION_INVITE);

  const handleClick = useCallback(
    inviteId => {
      const variables = { where: { id: inviteId } };

      removeOrganizationInvite({ variables }).then(response => {
        const { id } = response.data?.removeOrganizationInvite || {};

        client.writeQuery({
          query: ORGANIZATION_INVITES,
          variables: { where: { status: { equals: 'PENDING' } } },
          data: {
            organizationInvites: invites.filter(invite => invite.id !== id),
          },
        });

        toast.success('The invitation was successfully declined.');
      });
    },
    [removeOrganizationInvite, client, invites],
  );

  return (
    <div className='my-5 update-form-container'>
      <InviteForm callback={refetch} />

      <div className='invitations-list'>
        {invites?.map(invite => (
          <ListGroup className='clients-list' key={invite.id}>
            <ListGroupItem className='mb-2 hover-shadow-sm'>
              <div className='client-item'>
                <div className='client-item-content'>
                  <div className='pro-description'>
                    <h6 className='progress-text mb-1 text-sm d-block text-limit'>
                      {invite.email}{' '}
                      {invite.role === 'ADMIN' && (
                        <Badge pill color='info' className='mr-1'>
                          {invite.role}
                        </Badge>
                      )}
                    </h6>
                  </div>
                  <div className='text-xs'>
                    {startCase(capitalize(invite.professionalType))} / {capitalize(invite.status)}
                  </div>
                </div>
                <Button onClick={() => handleClick(invite.id)}>Decline</Button>
              </div>
            </ListGroupItem>
          </ListGroup>
        ))}
      </div>
    </div>
  );
};

export default Invitations;
