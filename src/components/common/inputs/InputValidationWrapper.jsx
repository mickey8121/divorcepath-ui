import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';

import { getIn, connect } from 'formik';
import classnames from 'classnames';
import dayjs from 'dayjs';
import { useDebouncedCallback } from 'use-debounce';

import Icon from 'components/common/Icon';

const InputValidationWrapper = props => {
  const {
    children,
    type,
    formik,
    label,
    name,
    hintComponent,
    options,
    hint,
    labelClassName,
    containerClassName,
    className,
    append,
    prepend,
    handleChange,
    onClick,
    onBlur,
    onFocus,
    placeholder,
    isValueNegative = false,
    touchable = true,
    disabled = false,
    isValidate = true,
    isDebounced = true,
    size = 'lg', // 'sm' | 'md' | 'lg' (default: 'lg')
    disabledOnClick,
    allowZero,
    isRequired,

    ...restProps
  } = props;

  const { errors, touched, handleBlur, setFieldValue, setFieldTouched, setFieldError, values } =
    formik;

  const textInput = useRef();

  const [focused, setFocus] = useState('');
  const [isOpenEye, setOpenEye] = useState(false);

  const hasError = useMemo(() => getIn(errors, name, false), [errors, name]);
  const isTouched = useMemo(() => getIn(touched, name, false), [name, touched]);
  const value = useMemo(() => getIn(values, name), [name, values]);

  // Use this middleware variable to prevent too much rerenders
  // on input change (see debounced callback below)
  const [cachedValue, setCachedValue] = useState('');

  // When value arrives from props we need to set it to cache
  useEffect(() => {
    if (value === undefined) {
      setCachedValue('');
    } else {
      setCachedValue(value);
    }
  }, [name, value]);

  const inputClassName = useMemo(
    () =>
      classnames('form-control', className, {
        'is-invalid': isValidate && hasError && isTouched,
      }),
    [className, isValidate, isTouched, hasError],
  );

  const customHandleBlur = e => {
    if (onBlur) {
      onBlur(e);
    }
    handleBlur(e);
    setFocus('');
  };

  const customHandleFocus = useCallback(
    e => {
      if (onFocus) onFocus(e);
      if (
        type === undefined &&
        (value === 'You' || value === 'Client' || value === 'Ex' || value?.startsWith('Child'))
      )
        formik.handleChange({
          target: { name: e.target.name, value: '' },
        });
      if (type === 'number' && value === '0')
        formik.handleChange({
          target: { name: e.target.name, value: '' },
        });
      setFocus('custom-focused');
    },
    [onFocus, type, value, formik],
  );

  const handleTouched = () => setFieldTouched(name, true);

  const customHandleChange = useCallback(
    e => {
      if (type === 'number' && isValueNegative) {
        formik.handleChange({
          target: { name: e.target.name, value: Math.abs(e.target.value || 0) * -1 },
        });
      } else if (type === 'number' && !allowZero) {
        formik.handleChange({
          target: { name: e.target.name, value: parseFloat(e.target.value || 0, 10) },
        });
      } else {
        formik.handleChange(e);
      }
    },
    [type, isValueNegative, allowZero, formik],
  );

  // This debounced version of handle change allows us to prevent a lot of rerenders
  // This is a formik architecture bug
  // Leading is important here for now, to make autofill work in browsers
  // Later we need to move it to a separate param, and enable only on sign form
  // Or other forms which use autofill a lot
  const debouncedHandleChange = useDebouncedCallback(handleChange || customHandleChange, 400, {
    leading: true,
  });

  // Here we set a value into cache and call a bebounced callback
  // which updates the formik state when needed (after interval)
  const cachedHandleChange = e => {
    if (e.persist) {
      e.persist();
    }

    if (e.nativeEvent.data === '.' && type === 'number') return null;

    const newValue = e.currentTarget.value || e.target.value;

    setCachedValue(newValue);

    if (isDebounced) {
      debouncedHandleChange(e);
    } else if (handleChange) {
      handleChange(e);
    } else {
      customHandleChange(e);
    }
  };

  const inputValue = useMemo(() => {
    if (type === 'number' && cachedValue === 0 && !allowZero) return '';
    if (type === 'number' && !allowZero) return parseFloat(cachedValue || 0, 10);

    if ([null, NaN, undefined].includes(cachedValue)) return '';
    if (type === 'date') return dayjs(cachedValue);

    return cachedValue;
  }, [cachedValue, type, allowZero]);

  const childrenWithProps = React.cloneElement(children, {
    ...restProps,
    disabled,
    name,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    size,
    ref: type === 'date' ? undefined : textInput,
    placeholder:
      type === 'number' && !placeholder && (value === 0 || allowZero) ? '0' : placeholder,
    isInvalid: isValidate && hasError && isTouched,
    type: type === 'password' ? (isOpenEye ? 'text' : 'password') : type,
    value: inputValue,
    options: options || null,
    className: `input-sm ${inputClassName}`,
    handleChange: type === 'date' ? handleChange : cachedHandleChange,
    handleBlur: customHandleBlur,
    onClick: touchable && handleTouched,
    handleFocus: customHandleFocus,
  });

  const handleFocus = useCallback(() => {
    if (textInput.current) {
      textInput.current.focus();
    }
  }, [textInput]);

  const handleClickOnEye = useCallback(() => {
    handleFocus();
    setOpenEye(!isOpenEye);
  }, [isOpenEye, handleFocus]);

  return (
    <div
      className={classnames('form-group custom-input', containerClassName, {
        'disabled-active': disabled && disabledOnClick,
        invalid: isValidate && hasError && isTouched,
        [`input-${size}`]: size,
        focused,
        disabled,
      })}
      onClick={() => disabled && disabledOnClick && disabledOnClick()}
    >
      {label && (
        <label
          htmlFor={name}
          className={labelClassName || 'form-control-label'}
          style={{ marginBottom: '0.2rem' }}
        >
          {label} {isRequired && <span className='required-field'>*</span>}
        </label>
      )}

      <div className='input-group'>
        {prepend && (
          <div className='prepend-icon' onClick={handleFocus}>
            <Icon name={prepend} />
          </div>
        )}

        {childrenWithProps}

        {append && (
          <div className='append-icon' onClick={handleFocus}>
            <Icon name={append} />
          </div>
        )}

        {type === 'password' && (
          <div className='append-icon' onClick={handleClickOnEye}>
            <Icon name={isOpenEye ? 'eye-on' : 'eye-off'} />
          </div>
        )}
      </div>

      <div
        className={classnames('invalid-feedback fade', {
          show: isValidate && hasError && isTouched,
        })}
      >
        {isValidate && hasError && isTouched && hasError}
      </div>
      {hintComponent && hintComponent}
      {hint && <small className='form-text text-muted mt-1'>{hint}</small>}
    </div>
  );
};

export default connect(InputValidationWrapper);
