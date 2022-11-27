import React from 'react';

import dayjs from 'dayjs';
import startCase from 'lodash/startCase';

import Button from 'components/common/Button';

import RatingStars from 'components/ProProfile/forms/reviews/RatingStars';

import { ReactComponent as LinkIcon } from 'img/icons/link.svg';

const ReviewListItem = ({ review, onClickEdit }) => {
  if (!review) return null;

  const { id, reviewerName, date, content, rating, sourceName, sourceUrl } = review;

  return (
    <div key={id} className='review-item'>
      <div className='review-main-info'>
        <h6 className='reviewer m-0'>{reviewerName}</h6>
        <RatingStars value={rating} />

        <Button
          className='review-edit-btn'
          iconClassName='edit-icon'
          leftIcon='edit'
          size='sm'
          color='link'
          onClick={onClickEdit(id)}
        >
          Edit
        </Button>
      </div>

      <p className='review-description m-0'>{content}</p>

      <div className='review-add-info'>
        <p className='text-muted m-0 mr-3'>{dayjs(date).format('MMMM D, YYYY')}</p>

        {sourceUrl ? (
          <a
            className='review-source-link m-0 mr-3'
            href={sourceUrl}
            target='_blank'
            rel='noreferrer'
          >
            From {startCase(sourceName)}
            <LinkIcon />
          </a>
        ) : (
          <p className='text-muted m-0 mr-3'>From {startCase(sourceName)}</p>
        )}
      </div>
    </div>
  );
};

export default ReviewListItem;
