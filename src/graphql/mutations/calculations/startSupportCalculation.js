import gql from 'graphql-tag';
import SUPPORT_CALCULATION_RESULT_FRAGMENT from 'graphql/fragments/result/supportCalculationResult';

const START_SUPPORT_CALCULATION = gql`
  ${SUPPORT_CALCULATION_RESULT_FRAGMENT}

  mutation startSupportCalculation($data: StartSupportCalculationInput!) {
    startSupportCalculation(data: $data) {
      supportCalculationResult {
        ...SUPPORT_CALCULATION_RESULT_FRAGMENT
      }
    }
  }
`;

export default START_SUPPORT_CALCULATION;
