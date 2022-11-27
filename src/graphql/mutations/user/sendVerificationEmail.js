import gql from 'graphql-tag';

const SEND_VERIFICATION_EMAIL = gql`
  mutation sentVerificationEmail {
    sendVerificationEmail
  }
`;

export default SEND_VERIFICATION_EMAIL;
