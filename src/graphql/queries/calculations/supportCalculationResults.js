import gql from 'graphql-tag';

import SUPPORT_CALCULATION_RESULT_FRAGMENT from 'graphql/fragments/result/supportCalculationResult';

const SUPPORT_CALCULATION_RESULTS = gql`
  ${SUPPORT_CALCULATION_RESULT_FRAGMENT}

  query supportCalculationResults(
    $where: SupportCalculationResultWhereInput
    $first: Int
    $last: Int
    $before: SupportCalculationResultWhereUniqueInput
    $after: SupportCalculationResultWhereUniqueInput
  ) {
    supportCalculationResults(
      where: $where
      first: $first
      last: $last
      before: $before
      after: $after
    ) {
      ...SUPPORT_CALCULATION_RESULT_FRAGMENT
    }
  }
`;

export default SUPPORT_CALCULATION_RESULTS;
