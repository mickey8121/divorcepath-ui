import gql from 'graphql-tag';

import CLIENT_FRAGMENT from '../../fragments/client';

const CLIENTS = gql`
  ${CLIENT_FRAGMENT}
  query clients(
    $where: ClientWhereInput
    $orderBy: [ClientOrderByInput!]
    $first: Int
    $last: Int
  ) {
    clients(where: $where, orderBy: $orderBy, first: $first, last: $last) {
      ...CLIENT_FRAGMENT
    }
  }
`;

export default CLIENTS;
