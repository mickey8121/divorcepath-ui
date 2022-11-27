import React, { memo } from 'react';

import classnames from 'classnames';

const star = ({ halfFilled = false, filled = false, ratingValue, onClick = null }) => (
  <svg
    key={ratingValue}
    width='20'
    height='20'
    viewBox='0 0 20 20'
    xmlns='http://www.w3.org/2000/svg'
    className={classnames('rating-star', { filled, 'half-filled': halfFilled })}
    onClick={() => onClick?.(ratingValue)}
  >
    <path d='M10 3C9.69976 3.00013 9.39951 3.17276 9.28709 3.51786L8.14828 7.02202C8.09923 7.17245 8.00385 7.3035 7.87578 7.39642C7.74771 7.48934 7.59353 7.53936 7.43531 7.53932H3.75122C3.0255 7.53932 2.72261 8.46896 3.31039 8.8963L6.29124 11.0615C6.41929 11.1546 6.51458 11.2858 6.56347 11.4363C6.61236 11.5869 6.61233 11.7491 6.56339 11.8996L5.42533 15.4038C5.20041 16.0943 5.99136 16.6693 6.57838 16.242L9.55924 14.0768C9.68734 13.9837 9.84163 13.9335 10 13.9335V3Z' />
    <path d='M10 3C10.3002 3.00013 10.6005 3.17276 10.7129 3.51786L11.8517 7.02202C11.9008 7.17245 11.9962 7.3035 12.1242 7.39642C12.2523 7.48934 12.4065 7.53936 12.5647 7.53932H16.2488C16.9745 7.53932 17.2774 8.46896 16.6896 8.8963L13.7088 11.0615C13.5807 11.1546 13.4854 11.2858 13.4365 11.4363C13.3876 11.5869 13.3877 11.7491 13.4366 11.8996L14.5747 15.4038C14.7996 16.0943 14.0086 16.6693 13.4216 16.242L10.4408 14.0768C10.3127 13.9837 10.1584 13.9335 10 13.9335V3Z' />
  </svg>
);

const bigStar = ({ halfFilled = false, filled = false, ratingValue, onClick = null }) => (
  <svg
    key={ratingValue}
    width='32'
    height='32'
    viewBox='0 0 32 32'
    xmlns='http://www.w3.org/2000/svg'
    className={classnames('rating-star', { filled, 'half-filled': halfFilled })}
    onClick={() => onClick?.(ratingValue)}
  >
    <path d='M16 4.8C15.5197 4.80021 15.0393 5.07641 14.8594 5.62858L13.0373 11.2352C12.9588 11.4759 12.8062 11.6856 12.6013 11.8343C12.3964 11.9829 12.1497 12.063 11.8965 12.0629H6.002C4.84084 12.0629 4.35623 13.5503 5.29667 14.2341L10.066 17.6983C10.2709 17.8473 10.4234 18.0573 10.5016 18.2982C10.5798 18.5391 10.5798 18.7986 10.5015 19.0394L8.68057 24.6461C8.32071 25.7509 9.58622 26.6709 10.5255 25.9872L15.2948 22.5229C15.4998 22.3739 15.7467 22.2936 16 22.2936V4.8Z' />
    <path d='M16 4.8C16.4803 4.80021 16.9607 5.07641 17.1406 5.62858L18.9627 11.2352C19.0412 11.4759 19.1938 11.6856 19.3987 11.8343C19.6036 11.9829 19.8503 12.063 20.1035 12.0629H25.998C27.1592 12.0629 27.6438 13.5503 26.7033 14.2341L21.934 17.6983C21.7291 17.8473 21.5766 18.0573 21.4984 18.2982C21.4202 18.5391 21.4202 18.7986 21.4985 19.0394L23.3194 24.6461C23.6793 25.7509 22.4138 26.6709 21.4745 25.9872L16.7052 22.5229C16.5002 22.3739 16.2533 22.2936 16 22.2936V4.8Z' />
  </svg>
);

const RatingStars = ({ value = 0, large, onChange }) => {
  const stars = [1, 2, 3, 4, 5].map(ratingValue => {
    const args = {};

    if (value >= ratingValue - 0.25) args.filled = true;
    else if (value >= ratingValue - 0.75) args.halfFilled = true;

    if (large) args.onClick = onChange;

    return (large ? bigStar : star)({ ...args, ratingValue });
  });

  return <div className={classnames('rating-stars', { clickable: onChange })}>{stars}</div>;
};

export default memo(RatingStars);
