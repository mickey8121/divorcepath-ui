import React, { useCallback } from 'react';

import classnames from 'classnames';

const CardHeader = ({ text, src, className, avatarContent }) => {
  const AvatarContent = useCallback(() => {
    if (!avatarContent) return <h2 className='h3 font-weight-bold mt-3'>{text}</h2>;

    return (
      <div className='avatar-content'>
        <h5 className='mb-0'>{text}</h5>
        <small className='d-block text-muted'>{avatarContent}</small>
      </div>
    );
  }, [avatarContent, text]);

  return (
    <div className={classnames('section-header', className)}>
      <img alt='placeholder' src={src} className='img-saturate' width='50' height='50' />
      <AvatarContent />
    </div>
  );
};
export default CardHeader;
