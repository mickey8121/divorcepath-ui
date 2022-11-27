import gql from 'graphql-tag';

const RELATIONSHIP = gql`
  fragment RELATIONSHIP on Relationship {
    id
    cohabitationDate
    isMarried
    isSeparated
    isDivorced
    marriageDate
    marriagePlace
    separationDate
    divorceDate
  }
`;

export default RELATIONSHIP;
