import gql from 'graphql-tag';

import SUPPORT_CALCULATION_RESULT_FRAGMENT from 'graphql/fragments/result/supportCalculationResult';
import SUPPORT_CALCULATION_FRAGMENT from 'graphql/fragments/calculation/supportCalculation';

const UPDATE_SUPPORT_CALCULATION = gql`
  ${SUPPORT_CALCULATION_FRAGMENT}
  ${SUPPORT_CALCULATION_RESULT_FRAGMENT}

  mutation updateSupportCalculation(
    $data: SupportCalculationUpdateInput!
    $where: SupportCalculationWhereUniqueInput!
  ) {
    updateSupportCalculation(data: $data, where: $where) {
      ...SUPPORT_CALCULATION_FRAGMENT
      calculationResult {
        ...SUPPORT_CALCULATION_RESULT_FRAGMENT
      }
    }
  }
`;

export default UPDATE_SUPPORT_CALCULATION;
