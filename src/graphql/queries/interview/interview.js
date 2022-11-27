import { gql } from '@apollo/client';

import INTERVIEW_FRAGMENT from 'graphql/fragments/interview';

const INTERVIEW = gql`
  ${INTERVIEW_FRAGMENT}

  query interview($where: IntakeInterviewWhereUniqueInput!) {
    interview(where: $where) {
      ...INTERVIEW_FRAGMENT
    }
  }
`;

export default INTERVIEW;
