import { gql } from '@apollo/client';

const CREATE_INTERVIEW = gql`
  mutation createInterview($data: CreateIntakeInterviewInput!) {
    createIntakeInterview(data: $data) {
      interview {
        id
        token
        status
        type
        createdAt
        updatedAt
      }
    }
  }
`;

export default CREATE_INTERVIEW;
