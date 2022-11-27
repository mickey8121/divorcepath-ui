import gql from 'graphql-tag';

import SUPPORT_CALCULATION_FRAGMENT from 'graphql/fragments/calculation/supportCalculation';

const DUPLICATE_SUPPORT_CALCULATION = gql`
  ${SUPPORT_CALCULATION_FRAGMENT}
  mutation duplicateSupportCalculation($data: DuplicateSupportCalculationInput!) {
    duplicateSupportCalculation(data: $data) {
      calculation {
        ...SUPPORT_CALCULATION_FRAGMENT
      }
    }
  }
`;

export default DUPLICATE_SUPPORT_CALCULATION;
