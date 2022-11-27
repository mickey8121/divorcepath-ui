import gql from 'graphql-tag';

const REMOVE_SUPPORT_CALCULATION = gql`
  mutation removeSupportCalculation($where: SupportCalculationWhereUniqueInput!) {
    removeSupportCalculation(where: $where) {
      id
    }
  }
`;

export default REMOVE_SUPPORT_CALCULATION;
