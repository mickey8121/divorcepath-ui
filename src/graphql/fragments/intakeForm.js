import gql from 'graphql-tag';

const INTAKE_FORM = gql`
  fragment INTAKE_FORM on IntakeForm {
    id
    firstName
    lastName
    phone
    email
    issue
    notes
    client {
      id
      createdAt
    }
  }
`;

export default INTAKE_FORM;
