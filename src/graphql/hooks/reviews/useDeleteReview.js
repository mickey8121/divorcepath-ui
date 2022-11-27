import { useCallback } from 'react';

import { useMutation } from '@apollo/client';

import DELETE_REVIEW from 'graphql/mutations/reviews/deleteReview';

const useDeleteReview = refetch => {
  const [deleteReviewMutation, { loading, error }] = useMutation(DELETE_REVIEW);

  const deleteReview = useCallback(
    async id => {
      try {
        await deleteReviewMutation({
          variables: {
            where: { id },
          },
        });

        await refetch();
      } catch (error) {}
    },
    [deleteReviewMutation, refetch],
  );

  return { deleteReview, loading, error };
};

export default useDeleteReview;
