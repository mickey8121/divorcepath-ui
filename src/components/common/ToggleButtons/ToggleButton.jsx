import React, { useMemo, useCallback } from 'react';

import classnames from 'classnames';
import { getIn } from 'formik';

import Button from 'components/common/Button';

import useCalculationContext from 'hooks/useCalculationContext';

const ToggleButton = props => {
  const { button, formik, value, name, size, disabled, disabledOnClick } = props;
  const { setFieldValue, values, setFieldTouched } = formik;
  const { value: buttonValue, label: buttonLabel, disabled: buttonDisabled, onClick } = button;

  const { isSubscriptionActive } = useCalculationContext();

  const uncontrolledValue = useMemo(
    () => (value === void 0 ? getIn(values, name) : value),
    [value, values, name],
  );

  const handleClick = useCallback(
    e => {
      e.stopPropagation();

      if (onClick && !(disabled || buttonDisabled)) {
        onClick();
        return;
      }

      if (disabledOnClick && (disabled || buttonDisabled) && !isSubscriptionActive) {
        disabledOnClick();
      } else {
        setFieldValue(name, buttonValue);
        setTimeout(() => setFieldTouched(name, true), 0);
      }
    },
    [
      buttonValue,
      disabled,
      disabledOnClick,
      buttonDisabled,
      isSubscriptionActive,
      name,
      onClick,
      setFieldTouched,
      setFieldValue,
    ],
  );

  return (
    <Button
      size={size}
      key={buttonValue}
      value={buttonValue}
      disabled={(disabled || buttonDisabled) && isSubscriptionActive}
      className={classnames({
        active: buttonValue === uncontrolledValue,
        disabled: disabled || buttonDisabled,
      })}
      onClick={handleClick}
    >
      {buttonLabel}
    </Button>
  );
};

export default ToggleButton;
