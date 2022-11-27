import React from 'react';

import ReviewsList from './ReviewsList';

const ReviewsForm = () => {
  return (
    <div className='update-form reviews-form'>
      <div className='inputs-container'>
        <div className='left-side'>
          <h4 className='title'>Reviews</h4>
          <p className='subtitle'>Post reviews from your clients directly to your profile.</p>
        </div>
        <div className='right-side'>
          <ReviewsList />
        </div>
      </div>
    </div>
  );
};

export default ReviewsForm;
