import React, { forwardRef } from 'react';

import InputValidationWrapper from './InputValidationWrapper';
import TextArea from './TextArea';

const TextAreaComponent = forwardRef(
  ({ name, placeholder, label, hint, hintComponent, isValidate, disabled, ...props }, ref) => (
    <InputValidationWrapper
      name={name}
      placeholder={placeholder}
      label={label}
      hint={hint}
      hintComponent={hintComponent}
      isValidate={isValidate}
      disabled={disabled}
      {...props}
    >
      <TextArea ref={ref} />
    </InputValidationWrapper>
  ),
);

export default TextAreaComponent;
