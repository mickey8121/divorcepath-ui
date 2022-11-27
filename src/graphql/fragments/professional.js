import gql from 'graphql-tag';

import PROFILE_FRAGMENT from 'graphql/fragments/profile';

import ORGANIZATION_LOCATION from './organization/organizationLocation';

const PROFESSIONAL_FRAGMENT = gql`
  ${PROFILE_FRAGMENT}
  ${ORGANIZATION_LOCATION}

  fragment PROFESSIONAL_FRAGMENT on Professional {
    id
    type
    biography
    publicPageEnabled

    profile {
      ...PROFILE_FRAGMENT
    }

    medias {
      id
      url
      type
      name
    }

    degree {
      id
      institution
      year
      degree
      abbreviation
      createdAt
      updatedAt
    }

    jurisdiction {
      id
      jurisdiction
      year
      createdAt
      updatedAt
    }

    locations {
      ...ORGANIZATION_LOCATION
    }

    createdAt
    updatedAt
  }
`;

export default PROFESSIONAL_FRAGMENT;
