import gql from 'graphql-tag';

import INPUT from 'graphql/fragments/calculation/input';

const CREATE_AMOUNT = gql`
  ${INPUT}

  mutation createAmount($data: AmountCreateInput!) {
    createAmount(data: $data) {
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
        ...INPUT
      }
      defaultInputs {
        ...INPUT
      }
    }
  }
`;

export default CREATE_AMOUNT;
