import React, { useCallback, useState } from 'react';

import { FormFeedback, FormGroup, Label } from 'reactstrap';
import InputMask from 'react-input-mask';
import { ErrorMessage, useField, useFormikContext } from 'formik';
import classNames from 'classnames';

const getFormattedValue = value => {
  if (value.includes('http://')) return value.replace('http://', '');

  if (value.includes('https://')) return value.replace('https://', '');

  return value;
};

const mask = `https://${Array.from(Array(1000))
  .map(() => '*')
  .join('')}`;

const HttpInput = ({
  name,
  label,
  onBlur,
  onFocus,
  size,
  disabled,
  hint,
  containerClassName,
  ...props
}) => {
  const [field] = useField(name);
  const { setFieldValue } = useFormikContext();

  const [isFocused, setIsFocused] = useState(false);

  const handleChange = useCallback(
    event => {
      setFieldValue(name, getFormattedValue(event.target.value));
    },
    [name, setFieldValue],
  );

  const handleFocus = useCallback(
    e => {
      if (onFocus) onFocus(e);
      setIsFocused(true);
    },
    [onFocus],
  );

  const handleBlur = useCallback(
    e => {
      if (onBlur) onBlur(e);
      setIsFocused(false);
    },
    [onBlur],
  );

  return (
    <FormGroup
      className={classNames('custom-input', containerClassName, {
        [`input-${size}`]: size,
        focused: isFocused,
        disabled,
      })}
    >
      {label && (
        <Label htmlFor='intakeSubmittedMessage' className='form-control-label'>
          {label}
        </Label>
      )}
      <div className='input-group'>
        <InputMask
          name={name}
          {...props}
          {...field}
          onChange={handleChange}
          maskChar={null}
          mask={mask}
          formatChars={{ '*': '[A-Za-z0-9-/:.#?=]' }}
          className='input-sm form-control'
          onBlur={handleBlur}
          onFocus={handleFocus}
        />
      </div>

      <ErrorMessage name={name}>{message => <FormFeedback>{message}</FormFeedback>}</ErrorMessage>

      {hint && <small className='form-text text-muted mt-1'>{hint}</small>}
    </FormGroup>
  );
};

export default HttpInput;
