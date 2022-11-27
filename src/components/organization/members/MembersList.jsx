import React, { useCallback } from 'react';

import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';

import Button from 'components/common/Button';

import MemberItem from 'components/organization/members/MemberItem';

import useCurrentUser from 'hooks/useCurrentUser';
import useConfirm from 'hooks/useConfirm';
import useModal from 'hooks/useModal';

import REMOVE_ORGANIZATION_MEMBER from 'graphql/mutations/organization/member/removeOrganizationMember';
import ORGANIZATION_QUERY from 'graphql/queries/organization/organization';
import REMOVE_ORGANIZATION_INVITE from 'graphql/mutations/organization/member/removeOrganizationInvite';
import ORGANIZATION_INVITES from 'graphql/queries/organization/organizationInvites';

const MembersList = ({ members }) => {
  const { isFreeSub, isOrgAdmin, me } = useCurrentUser();

  const { push } = useHistory();

  const [removeOrganizationInvite] = useMutation(REMOVE_ORGANIZATION_INVITE);
  const [removeOrganizationMember] = useMutation(REMOVE_ORGANIZATION_MEMBER, {
    update: (proxy, { data }) => {
      const cachedData = proxy.readQuery({
        query: ORGANIZATION_QUERY,
        variables: { where: { userId: me?.id } },
      });

      const newData = {
        ...cachedData,
        organization: {
          ...cachedData.organization,
          members: cachedData.organization.members?.filter(
            m => m.id !== data?.removeOrganizationMember?.organizationMember?.id,
          ),
        },
      };

      proxy.writeQuery({
        query: ORGANIZATION_QUERY,
        variables: { where: { userId: me?.id } },
        data: newData,
      });
    },
  });

  const { open } = useModal('EDIT_MEMBER');
  const { open: openInviteModal } = useModal('INVITE_MEMBER');

  const confirm = useConfirm({
    title: 'Are you sure you want to remove this user from the organization?',
    negativeBtnLabel: 'Not this time',
    positiveBtnLabel: 'Delete',
  });

  const handleDeleteMember = useCallback(
    async id => {
      if (!(await confirm())) return;

      const variables = {
        data: {
          memberId: id,
        },
      };

      removeOrganizationMember({ variables })
        .then(() => toast.success('Member of the organization successfully deleted'))
        .catch(err => toast.error(err.message));
    },
    [removeOrganizationMember, confirm],
  );

  const handleDeclineInvitation = useCallback(
    async inviteId => {
      const variables = { where: { id: inviteId } };

      try {
        await removeOrganizationInvite({
          variables,
          optimisticResponse: {
            __typename: 'Mutation',
            removeOrganizationInvite: {
              __typename: 'OrganizationInvite',
              id: inviteId,
            },
          },
          update: (proxy, { data }) => {
            const { id } = data?.removeOrganizationInvite || {};

            const invites = proxy.readQuery({
              query: ORGANIZATION_INVITES,
              variables: { where: { status: { equals: 'PENDING' } } },
            });

            proxy.writeQuery({
              query: ORGANIZATION_INVITES,
              variables: { where: { status: { equals: 'PENDING' } } },
              data: {
                organizationInvites: invites?.organizationInvites?.filter(
                  invite => invite.id !== id,
                ),
              },
            });
          },
        });

        toast.success('The invitation was successfully declined.');
      } catch {
        toast.success('Something went wrong. Try again later.');
      }
    },
    [removeOrganizationInvite],
  );

  return (
    <div className='members-form'>
      {members?.map(m => (
        <MemberItem
          member={m}
          key={m?.id}
          edit={() => open({ member: m })}
          remove={() => handleDeleteMember(m?.id)}
          decline={() => handleDeclineInvitation(m?.id)}
        />
      ))}
      {isOrgAdmin &&
        (isFreeSub ? (
          <Button size='md' color='primary' onClick={() => push('/profile/billing')}>
            Upgrade
          </Button>
        ) : (
          <Button
            color='link'
            size='lg'
            leftIcon='plus'
            disabled={isFreeSub && !isOrgAdmin}
            onClick={() => openInviteModal()}
          >
            Add Member
          </Button>
        ))}
    </div>
  );
};

export default MembersList;
