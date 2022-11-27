import gql from 'graphql-tag';

import CLIENT_FRAGMENT from 'graphql/fragments/client';

const CLIENT = gql`
  ${CLIENT_FRAGMENT}

  query client($where: ClientWhereUniqueInput!) {
    client(where: $where) {
      ...CLIENT_FRAGMENT
    }
  }
`;

export default CLIENT;
