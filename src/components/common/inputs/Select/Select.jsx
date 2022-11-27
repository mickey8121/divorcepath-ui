import React, { useCallback, useMemo } from 'react';

import classnames from 'classnames';
import RSelect from 'react-select';

import { UPGRADE_PLAN_MODAL_NAME } from 'components/modals/upgrade/UpgradePlanModal';

import useModal from 'hooks/useModal';
import useCalculationContext from 'hooks/useCalculationContext';

const Select = ({
  name,
  value,
  className,
  options,
  onChange,
  placeholder,
  label,
  defaultValue,
  onFocus,
  onBlur,
  disabled,
  isMulti,
  isClearable,
  containerClassName,
  size = 'lg', // 'sm' | 'md' | 'lg' (default: 'lg')
  hasError,
  isTouched,
  isRequired,
  ...props
}) => {
  const { open } = useModal(UPGRADE_PLAN_MODAL_NAME);
  const { isSubscriptionActive } = useCalculationContext();

  const selectClassName = useMemo(
    () =>
      classnames('w-100', 'custom-select-input', className, {
        'is-invalid': hasError && isTouched,
        [`size-${size}`]: size,
      }),
    [className, hasError, isTouched, size],
  );

  const errorMessageStyles = useMemo(
    () =>
      classnames('invalid-feedback fade', {
        show: hasError && isTouched,
      }),
    [hasError, isTouched],
  );

  const selectedValue = useMemo(() => {
    if (!value) return undefined;
    if (isMulti) return value;

    const currentValue = options?.find(opt => opt?.value === value);

    return {
      value,
      label: currentValue?.name || currentValue?.label,
    };
  }, [isMulti, options, value]);

  const handleSelect = useCallback(
    selectValue => {
      if (
        !isSubscriptionActive &&
        !selectValue?.isPremiumAvailable &&
        selectValue?.isPremiumAvailable !== undefined
      ) {
        open();
      }

      if (onChange) onChange(selectValue);
    },
    [isSubscriptionActive, open, onChange],
  );

  const optionsMapped = useMemo(
    () =>
      options?.map(option => ({
        ...option,
        label: option?.name || option?.label,
        value: option?.value,
        isDisabled: option?.isDisabled,
      })),
    [options],
  );

  return (
    <div
      className={classnames('form-group custom-input select-input w-100', containerClassName)}
      onClick={e => e.stopPropagation()}
    >
      {label && (
        <label className='form-control-label' style={{ marginBottom: '0.2rem' }}>
          {label} {isRequired && <span className='required-field'>*</span>}
        </label>
      )}

      <RSelect
        isMulti={isMulti}
        isClearable={isClearable}
        isDisabled={disabled}
        placeholder={placeholder}
        name={name}
        className={selectClassName}
        classNamePrefix='custom-select'
        options={optionsMapped}
        value={selectedValue}
        defaultValue={defaultValue || value}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={handleSelect}
        {...props}
      />

      <div className={errorMessageStyles}>{hasError && isTouched && hasError}</div>
    </div>
  );
};

export default Select;
