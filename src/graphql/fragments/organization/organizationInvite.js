import gql from 'graphql-tag';

const ORGANIZATION_INVITE = gql`
  fragment ORGANIZATION_INVITE on OrganizationInvite {
    id
    email
    status
    createdAt
    updatedAt

    professionalType
    role
    inviter {
      id
      professional {
        id
        organization {
          id
          name
        }
        profile {
          id
          firstName
          lastName
        }
      }
    }
    professional {
      id
      profile {
        id
        firstName
        lastName
      }
    }
  }
`;

export default ORGANIZATION_INVITE;
