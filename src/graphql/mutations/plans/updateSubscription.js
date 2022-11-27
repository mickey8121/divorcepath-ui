import gql from 'graphql-tag';

import ACCOUNT_SUBSCRIPTION_FRAGMENT from 'graphql/fragments/accountSubscription';

const UPDATE_SUBSCRIPTION = gql`
  mutation updateSubscription($input: UpdateSubscriptionInput!) {
    updateSubscription(input: $input) {
      accountSubscription {
        ...ACCOUNT_SUBSCRIPTION_FRAGMENT
      }
    }
  }
  ${ACCOUNT_SUBSCRIPTION_FRAGMENT}
`;

export default UPDATE_SUBSCRIPTION;
