import gql from 'graphql-tag';

import ORGANIZATION from 'graphql/fragments/organization/organization';
import PROFESSIONAL_FRAGMENT from 'graphql/fragments/professional';
import PROFILE_FRAGMENT from 'graphql/fragments/profile';
import ACCOUNT_SUBSCRIPTION_FRAGMENT from 'graphql/fragments/accountSubscription';
import CLIENT_FRAGMENT from 'graphql/fragments/client';

const SIGN_IN = gql`
  mutation signIn($data: SignInInput!) {
    signIn(data: $data) {
      token
      user {
        id
        email
        isEmailVerified

        professional {
          ...PROFESSIONAL_FRAGMENT

          assistants {
            ...PROFESSIONAL_FRAGMENT
          }

          organization {
            ...ORGANIZATION
          }
        }

        subscription {
          ...ACCOUNT_SUBSCRIPTION_FRAGMENT
        }

        client {
          ...CLIENT_FRAGMENT
        }
      }
    }
  }
  ${CLIENT_FRAGMENT}
  ${ACCOUNT_SUBSCRIPTION_FRAGMENT}
  ${ORGANIZATION}
  ${PROFILE_FRAGMENT}
  ${PROFESSIONAL_FRAGMENT}
`;

export default SIGN_IN;
