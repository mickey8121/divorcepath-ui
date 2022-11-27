import gql from 'graphql-tag';

import ORGANIZATION_INVITE from 'graphql/fragments/organization/organizationInvite';

const ORGANIZATION_INVITE_QUERY = gql`
  ${ORGANIZATION_INVITE}

  query organizationInvite($where: OrganizationInviteWhereUniqueInput!) {
    organizationInvite(where: $where) {
      ...ORGANIZATION_INVITE
    }
  }
`;

export default ORGANIZATION_INVITE_QUERY;
