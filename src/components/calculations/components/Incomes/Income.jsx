/* eslint-disable no-shadow */
import React, { useState, useMemo, useCallback, useEffect } from 'react';

import { useFormikContext } from 'formik';
import classnames from 'classnames';
import { Collapse, Row, Col } from 'reactstrap';
import { usePrevious } from 'react-delta';

import Button from 'components/common/Button';
import TextInputComponent from 'components/common/inputs/TextInput';
import CustomSelectContainer from 'components/common/inputs/Select/CustomSelectContainer';
import UpgradeButton from 'components/common/UpgradeButton';
import { UPGRADE_PLAN_MODAL_NAME } from 'components/modals/upgrade/UpgradePlanModal';
import Icon from 'components/common/Icon';

import {
  freeIncomeOptions,
  defaultAdjustment,
  defaultIncome,
  defaultHardship,
} from 'components/calculations/utils/defaultValues';

import useCalculationContext from 'hooks/useCalculationContext';
import useModal from 'hooks/useModal';

const freeOptionsKeys = freeIncomeOptions?.map(opt => opt?.key);

const Income = ({
  options,
  pathToAll,
  index,
  amount,
  remove,
  open,
  disabled = false,
  upgradeDescription = 'Income types other than T4 Employment income are a premium feature. Upgrade to calculate support with other income types.',
}) => {
  const { setFieldValue, setFieldTouched, isSubmitting } = useFormikContext();
  const { isSubscriptionActive } = useCalculationContext();
  const { open: openUpgradeModal, options: modalOptions } = useModal(UPGRADE_PLAN_MODAL_NAME);
  const prev = usePrevious(modalOptions);

  const chosenAmount = useMemo(
    () => options?.find(option => option.key === amount.key),
    [amount.key, options],
  );

  const [isPremiumAvailable, setIsPremiumAvailable] = useState(
    isSubscriptionActive || freeOptionsKeys.includes(chosenAmount?.key),
  );

  const isEmpty = useMemo(() => {
    if (amount?.userAmount === 0 && amount?.amount === 0) {
      return [defaultIncome.key, defaultAdjustment.key, defaultHardship.key].includes(amount?.key);
    }

    return false;
  }, [amount]);

  const [enabled, setEnabled] = useState(true);
  const [isOpen, setIsOpen] = useState(open || isEmpty);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    if (mediaQuery.matches) setEnabled(false);

    const handleScreen = e => {
      if (e?.matches) setEnabled(false);
      else setEnabled(true);
    };

    mediaQuery.addListener(handleScreen);

    return () => mediaQuery.removeListener(handleScreen);
  }, []);

  const optionsArray = useMemo(
    () =>
      options.map(({ key, label, disabled }) => ({
        value: key,
        name: label,
        isDisabled: disabled,
        isPremiumAvailable: freeOptionsKeys?.includes(key),
      })),
    [options],
  );

  const selectName = useMemo(() => `${pathToAll}.${index}.key`, [pathToAll, index]);

  const inputName = useMemo(() => `${pathToAll}.${index}.userAmount`, [pathToAll, index]);

  const setAmountType = useCallback(
    newIncome => {
      // called by select function for amount type select input at top of modal
      // set state to the defaults for the amount type selected by user
      if (newIncome.value === amount.key) return;

      const isPremiumAvailable = isSubscriptionActive
        ? true
        : freeIncomeOptions.find(opt => opt.key === newIncome.value);

      if (!isPremiumAvailable) openUpgradeModal();

      setIsPremiumAvailable(isPremiumAvailable);

      const setIncome = options.find(opt => opt.key === newIncome.value);
      const userAmount =
        !isSubscriptionActive && !isPremiumAvailable
          ? 0
          : setIncome?.sign === 'negative'
          ? amount?.userAmount > 0
            ? amount?.userAmount * -1
            : amount?.userAmount
          : amount?.userAmount < 0
          ? amount?.userAmount * -1
          : amount?.userAmount;
      setFieldValue(inputName, userAmount);
      setFieldValue(selectName, newIncome?.value);
      setFieldTouched(pathToAll, true);
    },
    [
      amount,
      openUpgradeModal,
      options,
      isSubscriptionActive,
      setFieldValue,
      inputName,
      selectName,
      setFieldTouched,
      pathToAll,
    ],
  );

  const toggle = useCallback(() => setIsOpen(prevIsOpen => !prevIsOpen), []);

  const isValueNegative = useMemo(() => chosenAmount?.sign === 'negative', [chosenAmount]);

  const handleFocus = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleBlur = useCallback(() => {
    if (enabled) {
      setIsOpen(false);
    }
  }, [enabled]);

  const isVisibleDesc = useMemo(
    () => isPremiumAvailable && !isSubscriptionActive,
    [isSubscriptionActive, isPremiumAvailable],
  );

  const isGrossUp = useMemo(() => chosenAmount?.key?.includes('gross_up'), [chosenAmount]);
  const isDisabled = useMemo(() => chosenAmount?.disabled === true, [chosenAmount]);

  const name = useMemo(
    () => (isGrossUp ? inputName.replace('userAmount', 'amount') : inputName),
    [inputName, isGrossUp],
  );

  useEffect(() => {
    if (prev !== modalOptions) setIsOpen(true);
  }, [modalOptions, prev]);

  return (
    <div className='income-item'>
      <Row>
        <Col sm={5} lg={7} className='col-10'>
          <TextInputComponent
            name={name}
            type='number'
            isValueNegative={isValueNegative}
            prepend='dollar'
            disabledOnClick={
              !(isSubmitting || isGrossUp || isDisabled || !chosenAmount) && openUpgradeModal
            }
            disabled={
              (!isSubscriptionActive && !isPremiumAvailable) ||
              disabled ||
              isSubmitting ||
              isGrossUp ||
              isDisabled ||
              !chosenAmount
            }
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </Col>

        <Col lg={5} className='col'>
          <Row noGutters className='select-row'>
            <CustomSelectContainer
              name={selectName}
              className={classnames('calculation-select', { disabled: isGrossUp || isDisabled })}
              options={optionsArray}
              defaultValue={chosenAmount}
              isDisabled={isGrossUp || isDisabled}
              handleChange={setAmountType}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />

            <div onClick={toggle} className='angle-btn'>
              <Icon name={`arrow-${isOpen ? 'up' : 'down'}`} />
            </div>
          </Row>
        </Col>
      </Row>

      <Collapse isOpen={isOpen}>
        <div className='pb-3'>
          <CustomSelectContainer
            name={selectName}
            className='d-sm-none'
            isDisabled={isSubmitting || isDisabled}
            options={optionsArray}
            defaultValue={chosenAmount}
            handleChange={setAmountType}
          />

          {chosenAmount?.description && (
            <div className='form-text text-muted mb-2'>
              <Icon name='info-circle' className='mr-2' height='20' width='20' />
              {chosenAmount?.description}
            </div>
          )}

          {isVisibleDesc && (
            <div className='upgrade-description bg-light p-3 mb-2'>
              <div className='d-flex justify-content-between'>
                <div className='form-text text-muted mr-2 mb-2'>
                  <Icon name='info-circle' className='mr-2' height='20' width='20' />
                  {upgradeDescription}
                </div>
              </div>
              <UpgradeButton className='mt-2 mb-3' />
            </div>
          )}

          <div className='d-flex justify-content-between'>
            <Button
              color='red-link'
              size='sm'
              leftIcon='trash'
              onClick={remove}
              disabled={disabled}
            >
              Delete
            </Button>
            <Button onClick={toggle} size='sm' color='link' leftIcon='cross'>
              Close
            </Button>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default Income;
