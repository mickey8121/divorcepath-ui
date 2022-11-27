import gql from 'graphql-tag';

const PROFILE_FRAGMENT = gql`
  fragment PROFILE_FRAGMENT on Profile {
    id
    firstName
    lastName
    middleName
    gender
    phone
    email
    birthDate
    avatarUrl
    matter {
      id
      number
      description
    }
    residence
    hasNewPartner
    partnerIncome
    northernResident
    ruralResident
    disabled
  }
`;

export default PROFILE_FRAGMENT;
