import gql from 'graphql-tag';

import AMOUNT_RESULT from './amountResult';

const AMOUNT_ARRAY_RESULT = gql`
  ${AMOUNT_RESULT}

  fragment AMOUNT_ARRAY_RESULT on AmountArrayResult {
    id
    total
    all {
      ...AMOUNT_RESULT
    }
  }
`;

export default AMOUNT_ARRAY_RESULT;
