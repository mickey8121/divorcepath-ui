import gql from 'graphql-tag';

import ORGANIZATION from 'graphql/fragments/organization/organization';

const UPDATE_ORGANIZATION = gql`
  ${ORGANIZATION}

  mutation updateOrganization(
    $data: OrganizationUpdateInput!
    $where: OrganizationWhereUniqueInput!
  ) {
    updateOrganization(data: $data, where: $where) {
      ...ORGANIZATION
    }
  }
`;

export default UPDATE_ORGANIZATION;
