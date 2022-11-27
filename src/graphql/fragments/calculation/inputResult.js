import gql from 'graphql-tag';

const INPUT_RESULT = gql`
  fragment INPUT_RESULT on InputResult {
    id
    name
    stringData
    arrayData
    childrenArray
    floatData
    defaultAmount {
      id
      key
      amount
      userAmount
      defaultAmount
    }
  }
`;

export default INPUT_RESULT;
