import gql from 'graphql-tag';

const REMOVE_USER = gql`
  mutation removeUser($where: RemoveUserInput!) {
    removeUser(where: $where) {
      user {
        id
      }
    }
  }
`;

export default REMOVE_USER;
