import gql from 'graphql-tag';

const REMOVE_ORGANIZATION_MEMBER = gql`
  mutation removeOrganizationMember($data: RemoveOrganizationMemberInput!) {
    removeOrganizationMember(data: $data) {
      organizationMember {
        id
      }
    }
  }
`;

export default REMOVE_ORGANIZATION_MEMBER;
