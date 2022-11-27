import gql from 'graphql-tag';

import SUPPORT_CALCULATION_FRAGMENT from 'graphql/fragments/calculation/supportCalculation';
import SUPPORT_CALCULATION_RESULT_FRAGMENT from 'graphql/fragments/result/supportCalculationResult';

const SUPPORT_CALCULATION = gql`
  ${SUPPORT_CALCULATION_FRAGMENT}
  ${SUPPORT_CALCULATION_RESULT_FRAGMENT}

  query supportCalculation($where: SupportCalculationWhereUniqueInput!) {
    supportCalculation(where: $where) {
      ...SUPPORT_CALCULATION_FRAGMENT
      calculationResult {
        ...SUPPORT_CALCULATION_RESULT_FRAGMENT
      }
    }
  }
`;

export default SUPPORT_CALCULATION;
