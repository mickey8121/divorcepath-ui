import gql from 'graphql-tag';

const CHANGE_PASSWORD = gql`
  mutation changePassword($data: ChangePasswordInput!) {
    changePassword(data: $data) {
      user {
        id
      }
      token
    }
  }
`;

export default CHANGE_PASSWORD;
