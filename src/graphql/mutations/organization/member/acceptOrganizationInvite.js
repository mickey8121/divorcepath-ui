import gql from 'graphql-tag';

import ORGANIZATION from 'graphql/fragments/organization/organization';

const ACCEPT_ORGANIZATION_INVITE = gql`
  ${ORGANIZATION}

  mutation acceptOrganizationInvite($data: AcceptOrganizationInviteInput!) {
    acceptOrganizationInvite(data: $data) {
      ...ORGANIZATION
    }
  }
`;

export default ACCEPT_ORGANIZATION_INVITE;
