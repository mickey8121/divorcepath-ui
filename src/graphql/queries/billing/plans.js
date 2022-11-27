import gql from 'graphql-tag';

const PLANS = gql`
  query plans {
    plans {
      id
      name
      isPro
    }
  }
`;

export default PLANS;
