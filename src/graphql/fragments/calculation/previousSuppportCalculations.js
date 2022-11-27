import gql from 'graphql-tag';

const PREVIOUS_SUPPORT_CALCULATIONS_FRAGMENT = gql`
  fragment PREVIOUS_SUPPORT_CALCULATIONS_FRAGMENT on SupportCalculation {
    id
    title
    showSpousalSupport
    updatedAt
    createdAt
    client {
      id
    }
  }
`;

export default PREVIOUS_SUPPORT_CALCULATIONS_FRAGMENT;
