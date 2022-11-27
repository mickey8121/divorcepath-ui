import { useCallback } from 'react';

import { useMutation } from '@apollo/client';

import CREATE_REVIEW from 'graphql/mutations/reviews/createReview';

const useCreateReview = refetch => {
  const [createReviewMutation, { loading, error }] = useMutation(CREATE_REVIEW);

  const createReview = useCallback(
    async data => {
      try {
        await createReviewMutation({
          variables: { data },
        });
        await refetch();
      } catch (error) {}
    },
    [createReviewMutation, refetch],
  );

  return { createReview, loading, error };
};

export default useCreateReview;
