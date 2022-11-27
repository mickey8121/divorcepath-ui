import gql from 'graphql-tag';

import ORGANIZATION from 'graphql/fragments/organization/organization';

const CREATE_ORGANIZATION = gql`
  ${ORGANIZATION}

  mutation createOrganization($data: CreateOrganizationInput!) {
    createOrganization(data: $data) {
      organization {
        ...ORGANIZATION
      }
    }
  }
`;

export default CREATE_ORGANIZATION;
