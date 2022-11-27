import gql from 'graphql-tag';

import ORGANIZATION_ISSUE from 'graphql/fragments/organization/organizationIssue';

const CREATE_ORGANIZATION_ISSUE = gql`
  ${ORGANIZATION_ISSUE}

  mutation createOrganizationIssue($data: OrganizationIssueCreateInput!) {
    createOrganizationIssue(data: $data) {
      ...ORGANIZATION_ISSUE
    }
  }
`;

export default CREATE_ORGANIZATION_ISSUE;
