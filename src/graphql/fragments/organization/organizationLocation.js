import gql from 'graphql-tag';

const ORGANIZATION_LOCATION = gql`
  fragment ORGANIZATION_LOCATION on OrganizationLocation {
    id
    phone
    residence
    street1
    street2
    city
    email
    postal
    website
  }
`;

export default ORGANIZATION_LOCATION;
