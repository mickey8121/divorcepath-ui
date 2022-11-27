import gql from 'graphql-tag';

import ORGANIZATION from 'graphql/fragments/organization/organization';

import CLIENT_FRAGMENT from '../../fragments/client';
import PROFESSIONAL_FRAGMENT from '../../fragments/professional';

const ME = gql`
  ${CLIENT_FRAGMENT}
  ${PROFESSIONAL_FRAGMENT}
  ${ORGANIZATION}

  query me {
    me {
      id
      email
      professional {
        ...PROFESSIONAL_FRAGMENT
        assistants {
          ...PROFESSIONAL_FRAGMENT
        }
        organization {
          ...ORGANIZATION
        }
      }
      client {
        ...CLIENT_FRAGMENT
      }
      isEmailVerified

      subscription {
        id
        status
        currentPeriodEnd
        cancelAtPeriodEnd
        canceledAt
        isUserNotified
        amountSubtotal
        amountTax
        amountTotal
        stripeId
        plan {
          id
          name
          trialDays
          isPro
        }
      }
    }
  }
`;

export default ME;
