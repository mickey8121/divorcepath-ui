import gql from 'graphql-tag';

const ORGANIZATION_MEMBER = gql`
  fragment ORGANIZATION_MEMBER on OrganizationMember {
    id
    role
    user {
      id
      professional {
        id
        type
        profile {
          id
          email
          firstName
          lastName
          gender
          avatarUrl
        }
      }
    }
    updatedAt
    createdAt
  }
`;

export default ORGANIZATION_MEMBER;
