import gql from 'graphql-tag';

import CLIENT_FRAGMENT from 'graphql/fragments/client';

const UPDATE_CLIENT = gql`
  ${CLIENT_FRAGMENT}
  mutation updateClient($data: ClientUpdateInput!, $where: ClientWhereUniqueInput!) {
    updateClient(data: $data, where: $where) {
      ...CLIENT_FRAGMENT
    }
  }
`;

export default UPDATE_CLIENT;
