import gql from 'graphql-tag';

import ORGANIZATION_ISSUE from 'graphql/fragments/organization/organizationIssue';

const UPDATE_ORGANIZATION_ISSUE = gql`
  ${ORGANIZATION_ISSUE}

  mutation updateOrganizationIssue(
    $data: OrganizationIssueUpdateInput!
    $where: OrganizationIssueWhereUniqueInput!
  ) {
    updateOrganizationIssue(data: $data, where: $where) {
      ...ORGANIZATION_ISSUE
    }
  }
`;

export default UPDATE_ORGANIZATION_ISSUE;
