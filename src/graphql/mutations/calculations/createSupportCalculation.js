import gql from 'graphql-tag';

import SUPPORT_CALCULATION_FRAGMENT from 'graphql/fragments/calculation/supportCalculation';

const CREATE_SUPPORT_CALCULATION = gql`
  ${SUPPORT_CALCULATION_FRAGMENT}

  mutation createSupportCalculation($data: SupportCalculationCreateInput!) {
    createSupportCalculation(data: $data) {
      ...SUPPORT_CALCULATION_FRAGMENT
    }
  }
`;

export default CREATE_SUPPORT_CALCULATION;
