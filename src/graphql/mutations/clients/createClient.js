import gql from 'graphql-tag';

import CLIENT_FRAGMENT from 'graphql/fragments/client';

const CREATE_CLIENT = gql`
  ${CLIENT_FRAGMENT}
  mutation createClient($data: ClientCreateInput!) {
    createClient(data: $data) {
      ...CLIENT_FRAGMENT
    }
  }
`;

export default CREATE_CLIENT;
