import React from 'react';

import classNames from 'classnames';

const Agreements = ({ checked, setChecked }) => (
  <div className='custom-control custom-checkbox'>
    <input
      className='custom-control-input shadow-none'
      name='registerCheckbox'
      id='customCheckRegister'
      onChange={() => setChecked(!checked)}
      type='checkbox'
    />
    <label
      className={classNames('custom-control-label', { checked: checked ? 'checked' : '' })}
      htmlFor='customCheckRegister'
    >
      <span>
        I agree to the{' '}
        <a href='https://www.divorcepath.com/terms' target='_blank' rel='noopener noreferrer'>
          Terms and Conditions
        </a>{' '}
        and{' '}
        <a href='https://www.divorcepath.com/privacy' target='_blank' rel='noopener noreferrer'>
          Privacy Policy
        </a>
        .
      </span>
    </label>
  </div>
);

export default Agreements;
