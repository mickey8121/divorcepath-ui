import gql from 'graphql-tag';

const SIGN_UP = gql`
  mutation signUp($data: SignUpInput!) {
    signUp(data: $data) {
      token
      user {
        id
        email
      }
    }
  }
`;

export default SIGN_UP;
