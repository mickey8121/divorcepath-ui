import React, { forwardRef } from 'react';

const Input = forwardRef(
  (
    {
      handleChange,
      handleBlur,
      name,
      placeholder,
      className,
      value,
      handleFocus,
      type,
      disabled,
      onClick,
      min,
      step,
      autoFocus,
    },
    ref,
  ) => (
    <input
      id={name}
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus={autoFocus}
      type={type || 'text'}
      pattern={type === 'number' ? '[0-9]+([.,][0-9]+)?' : null}
      inputMode={type === 'number' ? 'decimal' : null}
      name={name}
      value={value}
      ref={ref}
      disabled={disabled}
      onFocus={handleFocus}
      placeholder={placeholder}
      className={className}
      onBlur={handleBlur}
      onChange={handleChange}
      onClick={onClick}
      min={min}
      step={step}
    />
  ),
);

export default Input;
