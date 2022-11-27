import gql from 'graphql-tag';

import ORGANIZATION_ISSUE from 'graphql/fragments/organization/organizationIssue';

const DELETE_ORGANIZATION_ISSUE = gql`
  ${ORGANIZATION_ISSUE}

  mutation deleteOrganizationIssue($where: OrganizationIssueWhereUniqueInput!) {
    deleteOrganizationIssue(where: $where) {
      ...ORGANIZATION_ISSUE
    }
  }
`;

export default DELETE_ORGANIZATION_ISSUE;
