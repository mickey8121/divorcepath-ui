import gql from 'graphql-tag';

import AMOUNT_ARRAY from './amountArray';

const CLIENT_SUPPORT_PROFILE = gql`
  ${AMOUNT_ARRAY}

  fragment CLIENT_SUPPORT_PROFILE on PartyInput {
    id
    gender
    residence
    hasNewPartner
    firstName
    birthDate
    lastName
    northernResident
    ruralResident
    disabled
    energyCosts
    propertyCosts
    partnerIncome
    income {
      ...AMOUNT_ARRAY
    }
    hardship {
      ...AMOUNT_ARRAY
    }
    adjustments {
      ...AMOUNT_ARRAY
    }
    federalBenefits {
      ...AMOUNT_ARRAY
    }
    provincialBenefits {
      ...AMOUNT_ARRAY
    }
    federalDeductions {
      ...AMOUNT_ARRAY
    }
    provincialDeductions {
      ...AMOUNT_ARRAY
    }
    federalCredits {
      ...AMOUNT_ARRAY
    }
    provincialCredits {
      ...AMOUNT_ARRAY
    }
  }
`;

export default CLIENT_SUPPORT_PROFILE;
