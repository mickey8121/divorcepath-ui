import React, { useCallback } from 'react';

import classnames from 'classnames';
import RDatePicker from 'react-datepicker';
import InputMask from 'react-input-mask';

const DatePicker = ({
  disabled,
  name,
  value,
  isInvalid,
  setFieldValue,
  setFieldTouched,
  maxDate,
  minDate,
  handleChange,
  handleFocus,
  handleBlur,
  onCalendarClose,
}) => {
  const customHandleChange = useCallback(
    inputValue => {
      try {
        handleChange(inputValue);
      } catch (error) {
        setFieldValue(name, inputValue);

        setTimeout(() => {
          setFieldTouched(name, true);
        }, 0);
      }
    },
    [setFieldValue, name, setFieldTouched, handleChange],
  );

  const handleCloseCalendar = useCallback(() => {
    if (onCalendarClose) onCalendarClose(value);
  }, [onCalendarClose, value]);

  return (
    <RDatePicker
      customInput={<InputMask mask='9999-99-99' maskChar={null} />}
      name={name}
      selected={value.isValid?.() ? value.toDate() : null}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={customHandleChange}
      onYearChange={customHandleChange}
      onMonthChange={customHandleChange}
      onCalendarClose={handleCloseCalendar}
      maxDate={maxDate}
      minDate={minDate}
      className={classnames('custom-date-picker', { 'is-invalid': isInvalid })}
      placeholderText='YYYY-MM-DD'
      dateFormat='yyyy-MM-dd'
      showMonthDropdown
      showYearDropdown
      dropdownMode='select'
      disabled={disabled}
      autoComplete='off'
      shouldCloseOnSelect={false}
    />
  );
};

export default DatePicker;
