import gql from 'graphql-tag';

const CHILD_SUPPORT = gql`
  fragment CHILD_SUPPORT on ChildSupport {
    id
    employmentIncome
    guidelineIncome
    netAnnualSupport
    netMonthlySupport
    notionalChildren
    notionalMonthlySupport
    notionalSupport
    otherAnnualSupport
    otherMonthlySupport
    support
    tableAnnualSupport
    tableChildren
    tableMonthlySupport
    taxableIncome
  }
`;

export default CHILD_SUPPORT;
