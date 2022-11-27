import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useFormikContext, getIn } from 'formik';
import classnames from 'classnames';
import RSCreatableSelect from 'react-select/creatable';

// import customStyles from 'components/common/inputs/Select/styles';

const CreatableSelect = ({
  name,
  className,
  options,
  handleChange,
  label,
  defaultValue,
  disabled,
  isClearable = false,
  onCreate,
  isMulti,
  size = 'lg', // 'sm' | 'md' | 'lg' (default: 'lg')
  ...props
}) => {
  const { setFieldValue, setFieldTouched, values, errors, touched } = useFormikContext();

  const [inputValueState, setInputValueState] = useState('');
  const [optionsState, setOptionsState] = useState(options);

  const value = useMemo(() => getIn(values, name), [name, values]);
  const hasError = useMemo(() => getIn(errors, name, false), [name, errors]);
  const isTouched = useMemo(() => getIn(touched, name, false), [name, touched]);

  const selectClassName = useMemo(
    () =>
      classnames('w-100', 'custom-select-input', className, {
        'is-invalid': hasError && isTouched,
        'multi-select': isMulti,
        [`size-${size}`]: size,
      }),
    [className, hasError, isTouched, isMulti, size],
  );

  const errorMessageStyles = useMemo(
    () =>
      classnames('invalid-feedback fade', {
        show: hasError && isTouched,
      }),
    [hasError, isTouched],
  );

  const handleInputChange = useCallback(inputValue => setInputValueState(inputValue), []);

  const handleSelect = useCallback(
    selectValue => {
      setFieldValue(name, selectValue || []);
      setFieldTouched(name, true, false);
    },
    [name, setFieldTouched, setFieldValue],
  );

  const handleCreate = useCallback(
    inputValue => {
      const newOption = { value: inputValue, label: inputValue };

      setOptionsState([...optionsState, newOption]);
      setFieldValue(name, isMulti ? [...(value || []), newOption] : newOption);

      setInputValueState('');
    },
    [isMulti, name, optionsState, setFieldValue, value],
  );

  const optionsMapped = useMemo(
    () =>
      optionsState.map(option => ({
        ...option,
        label: option?.name || option?.label,
        value: option?.value,
        isDisabled: option?.isDisabled,
      })),
    [optionsState],
  );

  useEffect(() => setOptionsState(options || []), [options]);

  return (
    <div className='form-group custom-input select-input w-100'>
      {label && (
        <label className='form-control-label' style={{ marginBottom: '0.2rem' }}>
          {label}
        </label>
      )}

      <RSCreatableSelect
        {...props}
        isClearable={isClearable}
        isDisabled={disabled}
        name={name}
        className={selectClassName}
        classNamePrefix='custom-select'
        options={optionsMapped}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange || handleSelect}
        inputValue={inputValueState}
        onCreateOption={onCreate || handleCreate}
        onInputChange={handleInputChange}
        // styles={customStyles}
        isMulti={isMulti}
      />

      <div className={errorMessageStyles}>{hasError && isTouched && hasError}</div>
    </div>
  );
};

export default CreatableSelect;
