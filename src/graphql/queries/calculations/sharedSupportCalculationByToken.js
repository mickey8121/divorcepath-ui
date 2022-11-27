import gql from 'graphql-tag';

import SHARED_SUPPORT_CALCULATION_FRAGMENT from 'graphql/fragments/calculation/sharedSupportCalculation';

const SHARED_SUPPORT_CALCULATION_BY_TOKEN = gql`
  query sharedSupportCalculationByToken($where: WhereUniqueSupportCalculationShareInput!) {
    sharedSupportCalculationByToken(where: $where) {
      ...SHARED_SUPPORT_CALCULATION_FRAGMENT
    }
  }

  ${SHARED_SUPPORT_CALCULATION_FRAGMENT}
`;

export default SHARED_SUPPORT_CALCULATION_BY_TOKEN;
