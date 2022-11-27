import gql from 'graphql-tag';

const CREATE_SIGNED_URL = gql`
  mutation createSignedUrl {
    createSignedUrl {
      url
      fileName
    }
  }
`;

export default CREATE_SIGNED_URL;
