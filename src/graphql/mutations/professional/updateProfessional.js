import gql from 'graphql-tag';

import PROFESSIONAL_FRAGMENT from 'graphql/fragments/professional';

const UPDATE_PROFESSIONAL = gql`
  ${PROFESSIONAL_FRAGMENT}

  mutation updateProfessional(
    $data: ProfessionalUpdateInput!
    $where: ProfessionalWhereUniqueInput!
  ) {
    updateProfessional(data: $data, where: $where) {
      ...PROFESSIONAL_FRAGMENT
      assistants {
        ...PROFESSIONAL_FRAGMENT
      }
    }
  }
`;

export default UPDATE_PROFESSIONAL;
