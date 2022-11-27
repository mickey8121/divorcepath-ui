import gql from 'graphql-tag';

import ORGANIZATION from 'graphql/fragments/organization/organization';

const ORGANIZATION_QUERY = gql`
  ${ORGANIZATION}

  query organization($where: GetOrganizationWhereInput!) {
    organization(where: $where) {
      ...ORGANIZATION
    }
  }
`;

export default ORGANIZATION_QUERY;
