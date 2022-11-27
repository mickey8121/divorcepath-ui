import gql from 'graphql-tag';

import SUPPORT_CALCULATION_FRAGMENT from 'graphql/fragments/calculation/supportCalculation';
import SUPPORT_CALCULATION_RESULT_FRAGMENT from 'graphql/fragments/result/supportCalculationResult';

const SUPPORT_CALCULATIONS = gql`
  ${SUPPORT_CALCULATION_FRAGMENT}
  ${SUPPORT_CALCULATION_RESULT_FRAGMENT}

  query supportCalculations(
    $where: SupportCalculationWhereInput
    $orderBy: [SupportCalculationOrderByInput!]
    $after: SupportCalculationWhereUniqueInput
    $before: SupportCalculationWhereUniqueInput
    $first: Int
    $last: Int
  ) {
    supportCalculations(
      where: $where
      orderBy: $orderBy
      after: $after
      before: $before
      first: $first
      last: $last
    ) {
      ...SUPPORT_CALCULATION_FRAGMENT
      calculationResult {
        ...SUPPORT_CALCULATION_RESULT_FRAGMENT
      }
    }
  }
`;

export default SUPPORT_CALCULATIONS;
