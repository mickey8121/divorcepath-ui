import React from 'react';

const SupportOverviewItem = ({
  imageSrc,
  headerText,
  headerCaption,
  content,
  secondaryContent,
  description,
  chart,
  noBorder,
}) => (
  <div className={`row no-gutters ${!noBorder && 'border-bottom'} ml-1 mr-1 pt-4 pb-4`}>
    <div className='col-sm-6 col-xs-12 align-items-justify mb-2 pl-1'>
      <div className='d-flex align-items-center'>
        <span className='avatar'>
          <img alt='placeholder' src={imageSrc} className='img-saturate' />
        </span>

        <div className='avatar-content'>
          <h5 className='mb-0'>{headerText}</h5>
          {headerCaption}
        </div>
      </div>

      <div className='pt-3 p-0 m-0'>{description}</div>

      <div className='p-2 m-0 badge badge-secondary'>{content}</div>
    </div>
    <div className='col-sm-6 col-xs-12 d-flex pl-0 pb-0 pt-4 pr-0 justify-content-between'>
      {secondaryContent ? (
        <div className='container justify-content-center'>
          <div className='row no-gutters justify-content-between'>{chart}</div>
          <div className='row no-gutters justify-content-center'>
            <div className='p-2 m-0 badge badge-secondary'>{secondaryContent}</div>
          </div>
        </div>
      ) : (
        chart
      )}
    </div>
  </div>
);

export default SupportOverviewItem;
