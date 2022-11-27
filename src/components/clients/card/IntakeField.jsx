import React from 'react';

import classNames from 'classnames';

const IntakeField = ({ name, value, className, onClick, bold = true }) => {
  return (
    <div className={classNames('client-info-list-item', className)}>
      <span className='client-info-label'>{name}</span>
      {value ? (
        <span className={classNames('client-info-value', { bold })}> {value}</span>
      ) : (
        <button type='button' onClick={onClick} className='add-intake-data-btn'>
          {` Add`}
        </button>
      )}
    </div>
  );
};

export default IntakeField;
