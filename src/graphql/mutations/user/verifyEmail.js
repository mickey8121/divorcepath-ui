import gql from 'graphql-tag';

const VERIFY_EMAIL = gql`
  mutation verifyEmail($data: VerifyEmailInput!) {
    verifyEmail(data: $data) {
      token
      user {
        isEmailVerified
        id
        email
        professional {
          id
          profile {
            firstName
            lastName
            middleName
            email
          }
        }
        client {
          profile {
            firstName
            lastName
            middleName
            email
          }
        }
      }
    }
  }
`;

export default VERIFY_EMAIL;
