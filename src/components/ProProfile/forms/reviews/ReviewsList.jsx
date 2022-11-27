import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';

import ContentLoader from 'react-content-loader';

import Button from 'components/common/Button';
import Pagination from 'components/common/Pagination';
import FreePlanPlug from 'components/common/plugs/FreePlanPlug';

import ReviewsListItem from 'components/ProProfile/forms/reviews/ReviewsListItem';
import ReviewModal, { REVIEW_MODAL } from 'components/ProProfile/forms/reviews/ReviewModal';

import useModal from 'hooks/useModal';
import useReviewsQuery from 'graphql/hooks/reviews/useReviewsQuery';
import useCurrentUser from 'hooks/useCurrentUser';
import usePrevValue from 'hooks/usePrevValue';

const reviewsQueryLimit = 5;

const ReviewsList = () => {
  const { open } = useModal(REVIEW_MODAL);
  const { me, isActiveSub } = useCurrentUser();

  const [currentPage, setCurrentPage] = useState(1);

  const queryVariables = useMemo(
    () => ({
      where: {
        Professional: {
          id: { equals: me?.professional?.id },
        },
      },
      skip: (currentPage - 1) * 5,
      first: reviewsQueryLimit,
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    }),
    [me?.professional?.id, currentPage],
  );

  const [reviewsList, { loading, refetch }] = useReviewsQuery(queryVariables);
  const prevReviewsList = usePrevValue(reviewsList);

  const onClickNewReview = useCallback(() => open({ refetch }), [open, refetch]);

  const onClickEdit = useCallback(
    id => () => open({ initialValues: reviewsList?.nodes?.find(r => r.id === id), refetch }),
    [open, reviewsList, refetch],
  );

  useEffect(() => {
    if (!loading && !reviewsList?.nodes?.length && currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, reviewsList?.nodes]);

  if (!isActiveSub)
    return (
      <FreePlanPlug
        title='You need to Upgrade'
        description="To post reviews you'll need to upgrade to a Solo or Firm plan."
      />
    );

  return (
    <Fragment>
      <div className='reviews-container'>
        <div className='create-section'>
          <Button size='sm' leftIcon='plus' color='link' borderDashed onClick={onClickNewReview}>
            Add a review
          </Button>
        </div>

        {loading && (
          <div className='reviews-list skeleton'>
            {Array(5)
              .fill(0)
              .map((_, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <ContentLoader key={index} width='300' height={97} viewBox='0 0 300 97'>
                  <rect rx='5' ry='5' width='245' height='20' />
                  <rect y='30' rx='5' ry='5' width='300' height='21' />
                  <rect y='57' rx='5' ry='5' width='200' height='16' />
                </ContentLoader>
              ))}
          </div>
        )}

        {!!reviewsList?.nodes?.length && (
          <div className='reviews-list'>
            {reviewsList?.nodes?.map(review => (
              <ReviewsListItem key={review.id} review={review} onClickEdit={onClickEdit} />
            ))}
          </div>
        )}

        {(reviewsList?.count > 5 || prevReviewsList?.count > 5) && (
          <Pagination
            count={reviewsList?.count || prevReviewsList?.count}
            currentPage={currentPage}
            step={5}
            onPageClick={setCurrentPage}
            disabled={loading}
          />
        )}
      </div>

      <ReviewModal />
    </Fragment>
  );
};

export default ReviewsList;
