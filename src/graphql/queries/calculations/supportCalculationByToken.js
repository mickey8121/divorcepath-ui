import gql from 'graphql-tag';

import SUPPORT_CALCULATION_FRAGMENT from 'graphql/fragments/calculation/supportCalculation';
import SUPPORT_CALCULATION_RESULT_FRAGMENT from 'graphql/fragments/result/supportCalculationResult';

const SUPPORT_CALCULATION_BY_TOKEN = gql`
  ${SUPPORT_CALCULATION_FRAGMENT}
  ${SUPPORT_CALCULATION_RESULT_FRAGMENT}

  query supportCalculationByToken($data: SupportCalculationByToken!) {
    supportCalculationByToken(data: $data) {
      ...SUPPORT_CALCULATION_FRAGMENT
      calculationResult {
        ...SUPPORT_CALCULATION_RESULT_FRAGMENT
      }
    }
  }
`;

export default SUPPORT_CALCULATION_BY_TOKEN;
