import { gql } from '@apollo/client';

const INTERVIEW_CONFLICTS = gql`
  query interviewConflicts($where: IntakeInterviewWhereUniqueInput!) {
    intakeInterviewMergeDifference(where: $where) {
      content
    }
  }
`;

export default INTERVIEW_CONFLICTS;
