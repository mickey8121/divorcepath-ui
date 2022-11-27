import React, { forwardRef } from 'react';

const TextArea = forwardRef(
  ({ name, handleChange, handleBlur, placeholder, className, value, handleFocus }, ref) => (
    <textarea
      className={className}
      name={name}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      placeholder={placeholder}
      ref={ref}
    />
  ),
);

export default TextArea;
