import gql from 'graphql-tag';

const NOTIFY_USER_RESPONSE = gql`
  mutation notifyUser {
    notifyUser {
      accountSubscription {
        id
      }
    }
  }
`;

export default NOTIFY_USER_RESPONSE;
