import { useCallback } from 'react';

import { useMutation } from '@apollo/client';

import UPDATE_REVIEW from 'graphql/mutations/reviews/updateReview';

const useUpdateReview = () => {
  const [updateReviewMutation, { loading, error }] = useMutation(UPDATE_REVIEW);

  const updateReview = useCallback(
    ({ id, __typename, ...data } = {}) =>
      updateReviewMutation({
        variables: {
          where: { id },
          data,
        },
      }),
    [updateReviewMutation],
  );

  return { updateReview, loading, error };
};

export default useUpdateReview;
