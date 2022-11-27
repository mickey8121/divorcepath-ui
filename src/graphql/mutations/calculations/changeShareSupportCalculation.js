import gql from 'graphql-tag';

const CHANGE_SHARE_SUPPORT_CALCULATION = gql`
  mutation changeShareSupportCalculationStatus($data: ChangeShareSupportCalculationStatusInput!) {
    changeShareSupportCalculationStatus(data: $data) {
      supportCalculationShare {
        id
        email
        status
      }
    }
  }
`;

export default CHANGE_SHARE_SUPPORT_CALCULATION;
