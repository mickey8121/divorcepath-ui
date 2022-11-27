import gql from 'graphql-tag';

import CHILD_SUPPORT from './childSupport';
import SPOUSAL_SUPPORT from './spousalSupport';

const SUPPORT_CALCULATION_RESULT_FRAGMENT = gql`
  ${CHILD_SUPPORT}
  ${SPOUSAL_SUPPORT}

  fragment SUPPORT_CALCULATION_RESULT_FRAGMENT on SupportCalculationResult {
    id
    createdAt
    childSupport {
      formula
      payee
      payor
      clientChildSupport {
        ...CHILD_SUPPORT
      }
      exChildSupport {
        ...CHILD_SUPPORT
      }
    }
    spousalSupport {
      ...SPOUSAL_SUPPORT
    }
  }
`;

export default SUPPORT_CALCULATION_RESULT_FRAGMENT;
