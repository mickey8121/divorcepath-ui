import gql from 'graphql-tag';

const ACCOUNT_SUBSCRIPTION_FRAGMENT = gql`
  fragment ACCOUNT_SUBSCRIPTION_FRAGMENT on AccountSubscription {
    id
    user {
      id
    }
    cancelAtPeriodEnd
    canceledAt
    currentPeriodEnd
    status
    isUserNotified
    amountSubtotal
    amountTotal
    amountTax
    stripeId
    plan {
      id
      name
      isPro
    }
  }
`;

export default ACCOUNT_SUBSCRIPTION_FRAGMENT;
