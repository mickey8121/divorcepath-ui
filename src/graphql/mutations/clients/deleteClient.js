import gql from 'graphql-tag';

const DELETE_CLIENT = gql`
  mutation deleteClient($where: ClientWhereUniqueInput!) {
    deleteClient(where: $where) {
      id
    }
  }
`;

export default DELETE_CLIENT;
