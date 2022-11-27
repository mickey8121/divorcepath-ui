import gql from 'graphql-tag';

import SUPPORT_CALCULATION_RESULT_FRAGMENT from 'graphql/fragments/result/supportCalculationResult';

const SUPPORT_CALCULATION_RESULT = gql`
  ${SUPPORT_CALCULATION_RESULT_FRAGMENT}

  query supportCalculationResult($where: SupportCalculationResultWhereUniqueInput!) {
    supportCalculationResult(where: $where) {
      ...SUPPORT_CALCULATION_RESULT_FRAGMENT
    }
  }
`;

export default SUPPORT_CALCULATION_RESULT;
