import React from 'react';

import classnames from 'classnames';

const SectionHeader = ({ id, src, title, subtitle, bordered = true, name }) => (
  <div
    className={classnames('row no-gutters ml-1 mr-1 pt-4 pb-0 mb-4', { 'border-top': bordered })}
    id={id}
    name={name}
  >
    <div className='col-12 align-items-justify mb-2 pl-1'>
      <div className='d-flex align-items-center'>
        <span className='avatar'>
          <img alt='placeholder' src={src} className='img-saturate' />
        </span>
        <div className='avatar-content'>
          <h5 className='mb-0'>{title}</h5>
          <small className='d-block text-muted'>{subtitle}</small>
        </div>
      </div>
    </div>
  </div>
);

export default SectionHeader;
