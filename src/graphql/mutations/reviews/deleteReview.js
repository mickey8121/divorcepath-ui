import gql from 'graphql-tag';

const DELETE_REVIEW = gql`
  mutation deleteReview($where: ProfessionalReviewWhereUniqueInput!) {
    deleteReview(where: $where) {
      id
    }
  }
`;

export default DELETE_REVIEW;
