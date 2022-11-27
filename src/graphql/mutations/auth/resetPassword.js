import gql from 'graphql-tag';

const RESET_PASSWORD = gql`
  mutation resetPassword($data: ResetPasswordInput!) {
    resetPassword(data: $data)
  }
`;

export default RESET_PASSWORD;
