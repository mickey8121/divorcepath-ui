import gql from 'graphql-tag';

import ACCOUNT_SUBSCRIPTION_FRAGMENT from 'graphql/fragments/accountSubscription';

const CANCEL_SUBSCRIPTION = gql`
  mutation cancelSubscription {
    cancelSubscription {
      accountSubscription {
        ...ACCOUNT_SUBSCRIPTION_FRAGMENT
      }
    }
  }
  ${ACCOUNT_SUBSCRIPTION_FRAGMENT}
`;

export default CANCEL_SUBSCRIPTION;
