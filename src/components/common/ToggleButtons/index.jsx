import React, { useMemo } from 'react';

import classnames from 'classnames';
import { connect, getIn } from 'formik';
import { ButtonGroup } from 'reactstrap';

import ToggleButton from 'components/common/ToggleButtons/ToggleButton';

const ToggleButtons = ({
  buttons,
  disabled,
  formik,
  labelClassName,
  hint,
  hintComponent,
  label,
  name,
  className,
  isValidate = true,

  size = 'lg',
  value,
  disabledOnClick,
}) => {
  const { errors, touched, isSubmitting } = formik;

  const hasError = useMemo(() => getIn(errors, name, false), [errors, name]);
  const isTouched = useMemo(() => getIn(touched, name, false), [touched, name]);

  return (
    <div className={classnames('form-group', className)}>
      {!!label && (
        <label
          className={labelClassName || 'form-control-label'}
          style={{ marginBottom: '0.2rem' }}
        >
          {label}
        </label>
      )}
      <ButtonGroup className='custom-btn-group' disabled={disabled || isSubmitting} name={name}>
        {buttons.map(button => (
          <ToggleButton
            key={button.value}
            button={button}
            formik={formik}
            size={size}
            value={value}
            disabled={disabled}
            disabledOnClick={disabledOnClick}
            name={name}
          />
        ))}
      </ButtonGroup>
      <div
        className={classnames('invalid-feedback fade', {
          show: isValidate && hasError && isTouched,
        })}
      >
        {isValidate && hasError && isTouched && hasError}
      </div>
      {hintComponent}
      {hint && <small className='form-text text-muted mt-1'>{hint}</small>}
    </div>
  );
};

export default connect(ToggleButtons);
