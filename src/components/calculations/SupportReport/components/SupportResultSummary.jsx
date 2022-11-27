import React from 'react';

const SupportResultSummary = ({ imageSrc, headerText, headerCaption, content, description }) => (
  <div className='row no-gutters border-top ml-1 mr-1 pt-4 pb-0 mb-0'>
    <div className='col-sm-7 col-xs-12 align-items-justify mb-2 pl-1'>
      <div className='d-flex align-items-center'>
        <span className='avatar'>
          <img alt='placeholder' src={imageSrc} className='img-saturate' />
        </span>
        <div className='avatar-content'>
          <h5 className='mb-0'>{headerText}</h5>
          {headerCaption}
        </div>
      </div>
    </div>
    <div className='d-none d-sm-flex col-sm-5 col-xs-12 pl-0 pb-3'>
      <div className='col-12 align-items-left'>{content}</div>
    </div>

    <div className='d-block d-sm-none mt-3 mb-3 p-3 w-80 rounded-lg rounded-top rounded-bottom bg-secondary'>
      {content}
    </div>

    {description}
  </div>
);

export default SupportResultSummary;
