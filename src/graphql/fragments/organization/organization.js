import gql from 'graphql-tag';

import ORGANIZATION_MEMBER from './organizationMember';
import ORGANIZATION_INVITE from './organizationInvite';
import ORGANIZATION_LOCATION from './organizationLocation';
import ORGANIZATION_ISSUE from './organizationIssue';

const ORGANIZATION = gql`
  ${ORGANIZATION_MEMBER}
  ${ORGANIZATION_ISSUE}
  ${ORGANIZATION_LOCATION}
  ${ORGANIZATION_INVITE}

  fragment ORGANIZATION on Organization {
    id
    createdBy {
      id
    }
    description
    name
    members {
      ...ORGANIZATION_MEMBER
    }
    issues {
      ...ORGANIZATION_ISSUE
    }
    invites {
      ...ORGANIZATION_INVITE
    }
    locations {
      ...ORGANIZATION_LOCATION
    }
    type
    clientsShared
    updatedAt
    createdAt
    clients {
      id
    }
    issues {
      id
      image
      name
      description
    }
    logo
    subscriptionType

    primaryColor
    backgroundColor
    formUrn
    intakeSubmittedTitle
    intakeSubmittedMessage
    intakeFormHeader
    intakeFormFooter
    intakesEnabled
    intakeFormLogo
  }
`;

export default ORGANIZATION;
