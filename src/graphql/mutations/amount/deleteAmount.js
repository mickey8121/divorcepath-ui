import gql from 'graphql-tag';

const DELETE_AMOUNT = gql`
  mutation deleteAmount($where: AmountWhereUniqueInput!) {
    deleteAmount(where: $where) {
      id
    }
  }
`;

export default DELETE_AMOUNT;
