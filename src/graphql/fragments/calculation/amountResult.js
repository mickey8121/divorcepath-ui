import gql from 'graphql-tag';

import INPUT_RESULT from './inputResult';

const AMOUNT_RESULT = gql`
  ${INPUT_RESULT}

  fragment AMOUNT_RESULT on AmountResult {
    id
    key
    amount
    userAmount
    defaultAmount
    childSupport
    spousalSupport
    createdAt
    status
    userInputs {
      ...INPUT_RESULT
    }
    defaultInputs {
      ...INPUT_RESULT
    }
  }
`;

export default AMOUNT_RESULT;
