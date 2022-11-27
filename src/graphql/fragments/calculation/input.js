import gql from 'graphql-tag';

const INPUT = gql`
  fragment INPUT on Input {
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

export default INPUT;
