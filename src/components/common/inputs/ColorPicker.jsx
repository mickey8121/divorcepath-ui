import React, { useCallback, useMemo } from 'react';

import classnames from 'classnames';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { PopoverBody, UncontrolledPopover } from 'reactstrap';
import { useFormikContext } from 'formik';
import debounce from 'lodash/debounce';

const ColorPicker = ({ label, labelClassName, name, onChange }) => {
  const { setFieldValue, values } = useFormikContext();

  const onChangeAdditional = useCallback(
    value => onChange({ target: { name, value } }),
    [name, onChange],
  );

  const debouncedHandleChange = useMemo(
    () => debounce(onChangeAdditional, 1000),
    [onChangeAdditional],
  );

  const handleChange = useCallback(
    value => {
      setFieldValue(name, value);

      if (onChange) debouncedHandleChange(value);
    },
    [name, setFieldValue, onChange, debouncedHandleChange],
  );

  return (
    <div className={classnames('form-group custom-input color-picker')}>
      {label && (
        <label
          className={labelClassName || 'form-control-label'}
          style={{ marginBottom: '0.2rem' }}
        >
          {label}
        </label>
      )}
      <button
        id={name}
        type='button'
        className='btn-color'
        style={{ backgroundColor: values[name] }}
      >
        {' '}
      </button>
      <UncontrolledPopover trigger='legacy' placement='bottom' target={name}>
        <PopoverBody>
          <HexColorPicker color={values[name]} onChange={handleChange} />
        </PopoverBody>
      </UncontrolledPopover>
      <HexColorInput
        prefixed
        color={values[name]}
        onChange={handleChange}
        className='color-input'
      />
    </div>
  );
};

export default ColorPicker;
