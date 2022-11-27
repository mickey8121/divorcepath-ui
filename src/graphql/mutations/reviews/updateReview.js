import gql from 'graphql-tag';

import PROFESSIONAL_REVIEW_FRAGMENT from 'graphql/fragments/professionalReview';

const UPDATE_REVIEW = gql`
  ${PROFESSIONAL_REVIEW_FRAGMENT}

  mutation updateReview(
    $data: ProfessionalReviewUpdateInput!
    $where: ProfessionalReviewWhereUniqueInput!
  ) {
    updateReview(data: $data, where: $where) {
      ...PROFESSIONAL_REVIEW_FRAGMENT
    }
  }
`;

export default UPDATE_REVIEW;
