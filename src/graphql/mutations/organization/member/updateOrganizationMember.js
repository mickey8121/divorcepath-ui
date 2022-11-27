import gql from 'graphql-tag';

import ORGANIZATION_MEMBER from 'graphql/fragments/organization/organizationMember';

const UPDATE_ORGANIZATION_MEMBER = gql`
  ${ORGANIZATION_MEMBER}

  mutation updateOrganizationMember(
    $data: OrganizationMemberUpdateInput!
    $where: OrganizationMemberWhereUniqueInput!
  ) {
    updateOrganizationMember(data: $data, where: $where) {
      ...ORGANIZATION_MEMBER
    }
  }
`;

export default UPDATE_ORGANIZATION_MEMBER;
