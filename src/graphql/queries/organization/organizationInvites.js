import gql from 'graphql-tag';

import ORGANIZATION_INVITE from 'graphql/fragments/organization/organizationInvite';

const ORGANIZATION_INVITES = gql`
  ${ORGANIZATION_INVITE}

  query organizationInvites($where: OrganizationInviteWhereInput) {
    organizationInvites(where: $where) {
      ...ORGANIZATION_INVITE
    }
  }
`;

export default ORGANIZATION_INVITES;
