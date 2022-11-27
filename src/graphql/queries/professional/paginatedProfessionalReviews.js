import gql from 'graphql-tag';

import PROFESSIONAL_REVIEW_FRAGMENT from 'graphql/fragments/professionalReview';

const PROFESSIONAL_REVIEWS = gql`
  ${PROFESSIONAL_REVIEW_FRAGMENT}

  query PaginatedProfessionalReviews(
    $where: ProfessionalReviewWhereInput
    $orderBy: [ProfessionalReviewOrderByInput]
    $after: ProfessionalReviewWhereUniqueInput
    $first: Int
    $skip: Int
  ) {
    paginatedProfessionalReviews(
      where: $where
      orderBy: $orderBy
      after: $after
      first: $first
      skip: $skip
    ) {
      count
      nodes {
        ...PROFESSIONAL_REVIEW_FRAGMENT
      }
      hasNextPage
    }
  }
`;

export default PROFESSIONAL_REVIEWS;
