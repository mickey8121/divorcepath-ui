import React, { useCallback, useMemo } from 'react';

import { getIn, useFormikContext } from 'formik';

import Select from 'components/common/inputs/Select/Select';

const SelectField = ({ name, isMulti, ...props }) => {
  const { setFieldValue, setFieldTouched, values, errors, touched } = useFormikContext();

  const value = useMemo(() => getIn(values, name), [name, values]);
  const hasError = useMemo(() => getIn(errors, name, false), [name, errors]);
  const isTouched = useMemo(() => getIn(touched, name, false), [name, touched]);

  const handleSelect = useCallback(
    selectValue => {
      if (isMulti) {
        setFieldValue(name, selectValue, false);
      } else {
        setFieldValue(name, selectValue.value, false);
        setFieldTouched(name, true, false);
      }
    },
    [isMulti, setFieldTouched, setFieldValue, name],
  );

  return (
    <Select
      name={name}
      isMulti={isMulti}
      value={value}
      hasError={hasError}
      isTouched={isTouched}
      onChange={handleSelect}
      {...props}
    />
  );
};

export default SelectField;
