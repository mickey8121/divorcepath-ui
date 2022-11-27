import gql from 'graphql-tag';

import PREVIOUS_SUPPORT_CALCULATIONS_FRAGMENT from 'graphql/fragments/calculation/previousSuppportCalculations';

const PREVIOUS_SUPPORT_CALCULATIONS = gql`
  ${PREVIOUS_SUPPORT_CALCULATIONS_FRAGMENT}

  query supportCalculations($where: SupportCalculationWhereInput) {
    supportCalculations(where: $where) {
      ...PREVIOUS_SUPPORT_CALCULATIONS_FRAGMENT
    }
  }
`;

export default PREVIOUS_SUPPORT_CALCULATIONS;
