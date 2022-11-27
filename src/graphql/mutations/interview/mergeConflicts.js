import { gql } from '@apollo/client';

const MERGE_CONFLICTS = gql`
  mutation mergeConflicts(
    $where: IntakeInterviewWhereUniqueInput!
    $mode: IntakeInterviewMergeMode!
    $selected: [SelectIntakeInterviewPropertyToMergeInput!]
  ) {
    mergeIntakeInterview(where: $where, mode: $mode, selected: $selected)
  }
`;

export default MERGE_CONFLICTS;
