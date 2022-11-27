import gql from 'graphql-tag';

const CREATE_CHECKOUT_SESSION = gql`
  mutation createCheckoutSession($input: CreateCheckoutSessionInput!) {
    createCheckoutSession(input: $input)
  }
`;

export default CREATE_CHECKOUT_SESSION;
