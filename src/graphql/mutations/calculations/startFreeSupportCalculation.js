import gql from 'graphql-tag';

import SUPPORT_CALCULATION_FRAGMENT from 'graphql/fragments/calculation/supportCalculation';

const START_FREE_SUPPORT_CALCULATION = gql`
  ${SUPPORT_CALCULATION_FRAGMENT}

  mutation startFreeSupportCalculation($data: SupportCalculationCreateInput!) {
    startFreeSupportCalculation(data: $data) {
      ...SUPPORT_CALCULATION_FRAGMENT
    }
  }
`;

export default START_FREE_SUPPORT_CALCULATION;
