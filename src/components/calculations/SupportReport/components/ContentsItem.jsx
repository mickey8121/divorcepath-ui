import React from 'react';

const ContentsItem = ({ text, src, className, avatarContent }) => {
  const classname = className || 'row pl-3 pr-2 ml--3 mr--3 mt-4 mb-3 pt-3 pb-3 contents-item';

  return (
    <div>
      <div className={classname} id='client'>
        <span className={`avatar ml-5 ${avatarContent ? '' : 'mr-4'}`}>
          <img alt='placeholder' src={src} className='img-saturate' />
        </span>
        {avatarContent ? (
          <div className='avatar-content'>
            <h5 className='mb-0'>{text}</h5>
            <small className='d-block text-muted'>{avatarContent}</small>
          </div>
        ) : (
          <h4 className='mt-3'>{text}</h4>
        )}
      </div>
    </div>
  );
};

export default ContentsItem;
