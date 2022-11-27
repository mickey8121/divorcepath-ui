import { useMemo } from 'react';

import { useQuery } from '@apollo/client';

import PROFESSIONAL_REVIEWS from 'graphql/queries/professional/paginatedProfessionalReviews';

const useReviewsQuery = variables => {
  const { data, loading, refetch } = useQuery(PROFESSIONAL_REVIEWS, {
    variables,
    fetchPolicy: 'network-only',
  });

  const reviews = useMemo(() => data?.paginatedProfessionalReviews, [data]);

  return [reviews, { loading, refetch }];
};

export default useReviewsQuery;
