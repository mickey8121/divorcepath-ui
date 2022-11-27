import { gql } from '@apollo/client';

const DELETE_INTERVIEW = gql`
  mutation deleteInterview($where: IntakeInterviewWhereUniqueInput!) {
    deleteIntakeInterview(where: $where) {
      interview {
        token
      }
    }
  }
`;

export default DELETE_INTERVIEW;
