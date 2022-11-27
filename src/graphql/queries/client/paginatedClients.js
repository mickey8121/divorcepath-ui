import gql from 'graphql-tag';

import CLIENT_FRAGMENT from '../../fragments/client';

const CLIENTS = gql`
  ${CLIENT_FRAGMENT}

  query clients(
    $where: ClientWhereInput
    $first: Int
    $orderBy: [ClientOrderByInput!]
    $after: ClientWhereUniqueInput
  ) {
    paginatedClients(where: $where, first: $first, orderBy: $orderBy, after: $after) {
      count
      nodes {
        ...CLIENT_FRAGMENT
      }
      hasNextPage
    }
  }
`;

export default CLIENTS;
