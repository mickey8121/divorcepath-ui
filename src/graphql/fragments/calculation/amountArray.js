import gql from 'graphql-tag';

import INPUT from './input';

const AMOUNT_ARRAY = gql`
  ${INPUT}
  fragment AMOUNT_ARRAY on AmountArray {
    id
    total
    all {
      id
      key
      amount
      userAmount
      defaultAmount
      childSupport
      spousalSupport
      # createdAt
      status
      userInputs {
        ...INPUT
      }
      defaultInputs {
        ...INPUT
      }
    }
  }
`;

export default AMOUNT_ARRAY;
