import gql from 'graphql-tag';

import SUPPORT_CALCULATION_RESULT_FRAGMENT from 'graphql/fragments/result/supportCalculationResult';
import CHILDREN from 'graphql/fragments/children';
import CLIENT_SUPPORT_PROFILE from 'graphql/fragments/calculation/clientSupportProfile';
import RELATIONSHIP from 'graphql/fragments/calculation/relationship';

const SHARED_SUPPORT_CALCULATION_FRAGMENT = gql`
  fragment SHARED_SUPPORT_CALCULATION_FRAGMENT on SharedSupportCalculation {
    id
    agreedChildSupport
    agreedChildSupportPayor
    agreedSpousalSupport
    agreedSpousalSupportPayor
    showChildSupport
    taxYear
    title
    updatedAt
    createdAt
    showSpousalSupport
    isReportGenerated
    includeTaxSavings
    npvDiscountRate
    npvDuration
    hasChildren

    share {
      id
      email
      supportCalculationId
      status
      createdAt
      updatedAt

      sharedBy {
        email
        professional {
          profile {
            firstName
            middleName
            lastName
          }
        }
        client {
          profile {
            firstName
            middleName
            lastName
          }
        }
      }
    }

    calculationResult {
      ...SUPPORT_CALCULATION_RESULT_FRAGMENT
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

    children {
      ...CHILDREN
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

  ${RELATIONSHIP}
  ${CLIENT_SUPPORT_PROFILE}
  ${CHILDREN}
  ${SUPPORT_CALCULATION_RESULT_FRAGMENT}
`;

export default SHARED_SUPPORT_CALCULATION_FRAGMENT;
