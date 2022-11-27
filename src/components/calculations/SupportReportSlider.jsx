import React, { useState, useCallback, useMemo, useEffect } from 'react';

import { Input } from 'reactstrap';
import { useFormikContext } from 'formik';
import { scroller } from 'react-scroll';
import debounce from 'lodash/debounce';

import Button from 'components/common/Button';
import Slider from 'components/common/Slider';
import { UPGRADE_PLAN_MODAL_NAME } from 'components/modals/upgrade/UpgradePlanModal';

import useCalculationContext from 'hooks/useCalculationContext';
import useCurrentUser from 'hooks/useCurrentUser';
import useModal from 'hooks/useModal';

import toUSD from 'utils/toUSD';

const handleScroll = () => {
  scroller.scrollTo('#results', {
    duration: 400,
    delay: 200,
    smooth: 'easeInOutQuart',
    ignoreCancelEvents: true,
    isDynamic: true,
  });
};

const SupportReportSlider = ({ lowSpousalSupport, midSpousalSupport, highSpousalSupport }) => {
  const { isActiveSub } = useCurrentUser();
  const { setFieldValue, setFieldTouched, handleSubmit, values } = useFormikContext();
  const { supportCalculation } = useCalculationContext();

  const { open } = useModal(UPGRADE_PLAN_MODAL_NAME);

  const { low, mid, high } = useMemo(
    () => ({
      low: lowSpousalSupport[0],
      mid: midSpousalSupport[0] || 2500,
      high: highSpousalSupport[0] || 5000,
    }),
    [highSpousalSupport, lowSpousalSupport, midSpousalSupport],
  );
  const defaultValue = useMemo(() => {
    if (midSpousalSupport[0] === 0) return 0;

    return supportCalculation?.agreedSpousalSupport > -1
      ? supportCalculation?.agreedSpousalSupport
      : mid;
  }, [mid, midSpousalSupport, supportCalculation]);

  const [value, setValue] = useState(defaultValue);

  const minRange = useMemo(() => Math.round(low - low * 0.2), [low]);
  const maxRange = useMemo(() => Math.round(high + high * 0.2), [high]);

  const proposalText = useMemo(() => {
    if (value < mid) return 'low';

    if (value < high) return 'middle';

    return 'high';
  }, [high, mid, value]);

  const marks = useMemo(() => [low, mid, high], [high, low, mid]);

  const inputValue = useMemo(() => toUSD(value), [value]);

  const handleSliderChange = useCallback(sliderValue => setValue(sliderValue), []);

  const handleButtonClick = useCallback(() => {
    if (!isActiveSub) return open();

    setFieldValue('agreedSpousalSupport', value);
    setFieldTouched('agreedSpousalSupport');

    handleSubmit();

    handleScroll();
  }, [handleSubmit, isActiveSub, open, setFieldTouched, setFieldValue, value]);

  const handleResetButtonClick = useCallback(() => {
    if (values.agreedSpousalSupport === -1) return setValue(mid);

    setFieldValue('agreedSpousalSupport', -1);
    setFieldTouched('agreedSpousalSupport');

    handleSubmit();

    handleScroll();
  }, [handleSubmit, mid, setFieldTouched, setFieldValue, values.agreedSpousalSupport]);

  const handleInputChange = useCallback(event => {
    const parsedValue = parseInt(event.target.value?.match(/\d/g)?.join(''), 10);

    setValue(parsedValue || 0);
  }, []);

  const handleInputBlur = useCallback(() => {
    if (value > maxRange) setValue(maxRange);

    if (value < minRange) setValue(minRange);
  }, [maxRange, minRange, value]);

  const compareText = useMemo(() => {
    if (value < minRange || value > maxRange) {
      return `Please enter an amount between $${minRange} and $${maxRange}`;
    }

    if (value !== defaultValue) {
      return `Comparing a proposed amount of $${value} spousal support to the guideline range.`;
    }

    if (isActiveSub) return `Compare $${value} spousal support to the guideline range?`;

    return `Upgrade your account to compare $${value} in monthly spousal support to the guideline range.`;
  }, [defaultValue, isActiveSub, maxRange, minRange, value]);

  const handleAfterChange = useCallback(() => {
    if (isActiveSub) return null;

    open();
  }, [isActiveSub, open]);

  const getMarkText = useCallback(
    key => {
      switch (key) {
        case low:
          return 'L';

        case mid:
          return 'M';

        case high:
          return 'H';

        default:
          return '';
      }
    },
    [high, low, mid],
  );

  const handleMouseDown = useCallback((event, key) => {
    event.stopPropagation();

    setValue(key);
  }, []);

  const CustomMark = useCallback(
    props => {
      const text = getMarkText(props.key);

      return (
        <span {...props} onMouseDown={event => handleMouseDown(event, props.key)} name={text}>
          ({text})
        </span>
      );
    },
    [getMarkText, handleMouseDown],
  );

  const handleSetAgreedSpousalSupport = useCallback(
    newValue => setFieldValue('agreedSpousalSupport', newValue),
    [setFieldValue],
  );

  const debouncedHandleChange = useMemo(
    () => debounce(handleSetAgreedSpousalSupport, 500),
    [handleSetAgreedSpousalSupport],
  );

  useEffect(() => {
    if (value === mid || defaultValue === 0) setFieldValue('agreedSpousalSupport', -1);
    else debouncedHandleChange(value);
  }, [debouncedHandleChange, defaultValue, mid, setFieldValue, value]);

  return (
    <div className='spousal-slider'>
      <h6>Negotiate Support</h6>
      <p>Negotiate support by comparing your proposal to the guideline range.</p>
      <div className='spousal-slider-container'>
        <div className='d-flex flex-column align-items-center'>
          <p className='text-muted mb-1'>Your Proposal</p>
          <h6 className='h2 font-weight-bold mb-0'>
            <Input
              className='currency-input'
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
          </h6>
          <p className='neutral-300'>
            {proposalText}
            -range (
            <a
              href='https://www.divorcepath.com/help/spousal-support-quickstart#toc-review-your-results'
              target='_blank'
              rel='noopener noreferrer'
            >
              more info
            </a>
            )
          </p>
        </div>

        <Slider
          marks={marks}
          min={minRange}
          max={maxRange}
          onChange={handleSliderChange}
          value={value}
          onAfterChange={handleAfterChange}
          renderMark={CustomMark}
        />
      </div>

      <div className='collapse-body'>
        <p>{compareText}</p>
        <div className='btn-container'>
          <Button onClick={handleButtonClick} disabled={value === defaultValue}>
            {isActiveSub ? 'Compare' : 'Upgrade'}
          </Button>
          {value !== mid && (
            <button type='button' className='btn btn-default' onClick={handleResetButtonClick}>
              Reset ranges
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportReportSlider;
