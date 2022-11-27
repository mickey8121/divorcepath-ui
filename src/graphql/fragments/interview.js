import { gql } from '@apollo/client';

const INTERVIEW_FRAGMENT = gql`
  fragment INTERVIEW_FRAGMENT on Interview {
    id
    clientEmail
    organizationId
    token
    status
    type
    totalFields
    completedFields
    mergedFields
    conflictFields
    intakeInterview {
      id
      legalIssues {
        id
        name
      }
      profile {
        firstName
        lastName
        gender
        phone
        email
        birthDate
        residence
        hasNewPartner
      }
      address {
        city
        country
        postal
        residence
        street1
      }
      exProfile {
        firstName
        lastName
        gender
        phone
        email
        birthDate
        residence
        hasNewPartner
      }
      exAddress {
        city
        country
        postal
        residence
        street1
      }
      relationship {
        cohabitationDate
        isMarried
        isSeparated
        marriageDate
        separationDate
      }
      children {
        id
        disabled
        firstName
        gender
        parenting
        isOfRelationship
        birthDate
        startSchoolDate
        endSchoolDate
        claimAsDependent
        isDependent
        supportedBy
        supportType
        priorRelationship
      }
      exLawyer
      exLawyerName
      exLawyerCompanyName
      story
      askStory
      shortInterview
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
  }
`;

export default INTERVIEW_FRAGMENT;
