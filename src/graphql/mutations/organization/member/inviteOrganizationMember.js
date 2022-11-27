import gql from 'graphql-tag';

import ORGANIZATION_INVITE from 'graphql/fragments/organization/organizationInvite';

const INVITE_ORGANIZATION_MEMBER = gql`
  ${ORGANIZATION_INVITE}

  mutation inviteOrganizationMember($data: InviteOrganizationMemberInput!) {
    inviteOrganizationMember(data: $data) {
      organizationInvite {
        ...ORGANIZATION_INVITE
      }
    }
  }
`;

export default INVITE_ORGANIZATION_MEMBER;
