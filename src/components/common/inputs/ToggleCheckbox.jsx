import React from 'react';

import classnames from 'classnames';

const ToggleCheckbox = ({ onChange, children, margin, isChecked, className, disabled }) => (
  <label className={classnames('toggle-checkbox', className)}>
    <div className={margin}>
      <div className={`toggle-checkbox-container `}>
        <input
          className='toggle-checkbox-input'
          type='checkbox'
          onChange={onChange}
          checked={!!isChecked}
          disabled={disabled}
        />
        <span className='toggle-checkbox-slider' />
      </div>
    </div>
    {children}
  </label>
);

export default ToggleCheckbox;
