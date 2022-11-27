import gql from 'graphql-tag';

import CHILDREN from '../children';
import CLIENT_FRAGMENT from '../client';
import CLIENT_SUPPORT_PROFILE from './clientSupportProfile';
import INPUT from './input';
import RELATIONSHIP from './relationship';
import SUPPORT_CALCULATION_RESULT_FRAGMENT from '../result/supportCalculationResult';

const SUPPORT_CALCULATION_FRAGMENT = gql`
  ${CLIENT_FRAGMENT}
  ${RELATIONSHIP}
  ${INPUT}
  ${CLIENT_SUPPORT_PROFILE}
  ${CHILDREN}
  ${SUPPORT_CALCULATION_RESULT_FRAGMENT}

  fragment SUPPORT_CALCULATION_FRAGMENT on SupportCalculation {
    id
    isReportGenerated
    agreedChildSupport
    agreedChildSupportPayor
    agreedSpousalSupport
    hasChildren
    npvDiscountRate
    npvDuration
    # agreedSpousalSupportPayor
    showChildSupport
    showSpousalSupport
    taxYear
    title
    updatedAt
    createdAt
    showChildSupport
    shares {
      id
      email
      status
    }
    professional {
      id
      profile {
        id
        firstName
        lastName
      }
      organization {
        id
        name
        logo
      }
    }
    calculationResult {
      ...SUPPORT_CALCULATION_RESULT_FRAGMENT
    }
    children {
      ...CHILDREN
    }
    childExpenses {
      id
      total
      all {
        id
        key
        amount
        userAmount
        defaultAmount
        childSupport
        spousalSupport
        createdAt
        status
        userInputs {
          ...INPUT
        }
        defaultInputs {
          ...INPUT
        }
      }
    }
    client {
      ...CLIENT_FRAGMENT
    }
    clientSupportProfile {
      ...CLIENT_SUPPORT_PROFILE
    }
    exSupportProfile {
      ...CLIENT_SUPPORT_PROFILE
    }
    relationship {
      ...RELATIONSHIP
    }
  }
`;

export default SUPPORT_CALCULATION_FRAGMENT;
