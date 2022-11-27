import gql from 'graphql-tag';

import RELATIONSHIP from 'graphql/fragments/calculation/relationship';
import PROFESSIONAL_FRAGMENT from 'graphql/fragments/professional';
import PROFILE_FRAGMENT from 'graphql/fragments/profile';
import CHILDREN_FRAGMENT from 'graphql/fragments/children';
import INTAKE_FORM from 'graphql/fragments/intakeForm';

const CLIENT_FRAGMENT = gql`
  ${RELATIONSHIP}
  ${PROFESSIONAL_FRAGMENT}
  ${PROFILE_FRAGMENT}
  ${CHILDREN_FRAGMENT}
  ${INTAKE_FORM}
  fragment CLIENT_FRAGMENT on Client {
    id
    updatedAt
    createdAt
    supportCalculations {
      id
      updatedAt
      createdAt
      showSpousalSupport
      title
      shares {
        id
        email
        status
      }
    }
    user {
      id
    }
    profile {
      ...PROFILE_FRAGMENT
    }
    exProfile {
      ...PROFILE_FRAGMENT
    }
    relationship {
      ...RELATIONSHIP
    }
    children {
      ...CHILDREN
    }
    address {
      city
      country
      postal
      province
      residence
      street1
      street2
    }
    exAddress {
      city
      country
      postal
      province
      residence
      street1
      street2
    }
    professionals {
      ...PROFESSIONAL_FRAGMENT
    }
    profileProgress {
      background
      address
      children
      relationship
      exBackground
      exAddress
    }
    intakeForm {
      ...INTAKE_FORM
    }
    interviews {
      id
      token
      status
      type
      intakeInterview {
        id
      }
      createdAt
      updatedAt
    }
    legalIssues {
      id
      image
      name
      description
    }
    type
  }
`;

export default CLIENT_FRAGMENT;
