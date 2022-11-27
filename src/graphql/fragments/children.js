import gql from 'graphql-tag';

const CHILDREN = gql`
  fragment CHILDREN on Children {
    id
    birthDate
    startSchoolDate
    endSchoolDate
    claimAsDependent
    disabled
    firstName
    gender
    isDependent
    isOfRelationship
    priorRelationship
    lastName
    middleName
    parenting
    supportedBy
    supportType
    supportAmount
    supportDeductible
    childIncome
    createdAt
    updatedAt
  }
`;

export default CHILDREN;
