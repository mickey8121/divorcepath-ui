import gql from 'graphql-tag';

const ORGANIZATION_ISSUE = gql`
  fragment ORGANIZATION_ISSUE on OrganizationIssue {
    id
    image
    name
    description
  }
`;

export default ORGANIZATION_ISSUE;
