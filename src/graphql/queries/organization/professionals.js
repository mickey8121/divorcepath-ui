import gql from 'graphql-tag';

import PROFESSIONAL_FRAGMENT from 'graphql/fragments/professional';

const PROFESSIONALS = gql`
  ${PROFESSIONAL_FRAGMENT}

  query professionals($where: ProfessionalWhereInput) {
    professionals(where: $where) {
      ...PROFESSIONAL_FRAGMENT
    }
  }
`;

export default PROFESSIONALS;
