import gql from 'graphql-tag';

import ORGANIZATION_INVITE from 'graphql/fragments/organization/organizationInvite';

const REMOVE_ORGANIZATION_INVITE = gql`
  ${ORGANIZATION_INVITE}

  mutation removeOrganizationInvite($where: OrganizationInviteWhereUniqueInput!) {
    removeOrganizationInvite(where: $where) {
      ...ORGANIZATION_INVITE
    }
  }
`;

export default REMOVE_ORGANIZATION_INVITE;
