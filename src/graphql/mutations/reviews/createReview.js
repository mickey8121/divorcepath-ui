import gql from 'graphql-tag';

import PROFESSIONAL_REVIEW_FRAGMENT from 'graphql/fragments/professionalReview';

const CREATE_REVIEW = gql`
  ${PROFESSIONAL_REVIEW_FRAGMENT}

  mutation createReview($data: ProfessionalReviewCreateInput!) {
    createReview(data: $data) {
      ...PROFESSIONAL_REVIEW_FRAGMENT
    }
  }
`;

export default CREATE_REVIEW;
