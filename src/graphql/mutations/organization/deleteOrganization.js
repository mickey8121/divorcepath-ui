import gql from 'graphql-tag';

import ORGANIZATION from 'graphql/fragments/organization/organization';

const DELETE_ORGANIZATION = gql`
  ${ORGANIZATION}

  query deleteOrganization($data: RemoveOrganizationInput!) {
    deleteOrganization(data: $data) {
      organization {
        ...ORGANIZATION
      }
    }
  }
`;

export default DELETE_ORGANIZATION;
