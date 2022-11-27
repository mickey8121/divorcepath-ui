import React, { Fragment, useCallback, useMemo, useEffect, useState } from 'react';

import { connect } from 'formik';
import numeral from 'numeral';
import { useMutation } from '@apollo/client';
import { usePrevious } from 'react-delta';

import TextInput from 'components/common/inputs/TextInput';
import LearnMoreLink from 'components/calculations/components/common/LearnMoreLink';
import { UPGRADE_PLAN_MODAL_NAME } from 'components/modals/upgrade/UpgradePlanModal';
import Button from 'components/common/Button';
import Icon from 'components/common/Icon';

import useCalculationContext from 'hooks/useCalculationContext';
import useModal from 'hooks/useModal';

import customGet from 'utils/get';

import DELETE_INPUT from 'graphql/mutations/calculations/deleteInput';

const OverrideCreditForm = ({
  formik,
  amount,
  index,
  setOpen,
  otherAmountPath,
  displayInfo,
  pathToAmount,
}) => {
  const { isSubscriptionActive } = useCalculationContext();
  const { open } = useModal(UPGRADE_PLAN_MODAL_NAME);
  const [whereState, setWhereState] = useState(null);
  const [deleteInput, { loading }] = useMutation(DELETE_INPUT);

  const { where } = Object.values(amount.userInputs ?? {})[0]?.[0] ?? {};

  const handleFocus = useCallback(() => setOpen({ isOpen: true, index }), [setOpen, index]);
  const handleBlur = useCallback(() => setOpen({ isOpen: false, index: null }), [setOpen]);

  const createPath = useCallback((path, toValue) => `${path}.userInputs${toValue ? '.0' : ''}`, []);

  const pathToCurrentAmount = useMemo(
    () => createPath(pathToAmount, true),
    [pathToAmount, createPath],
  );
  const otherPath = useMemo(() => createPath(otherAmountPath, true), [otherAmountPath, createPath]);

  const pathToUserInputs = useMemo(() => createPath(pathToAmount), [pathToAmount, createPath]);
  const otherPathToUserInputs = useMemo(
    () => createPath(otherAmountPath),
    [otherAmountPath, createPath],
  );

  const currentValue = useMemo(
    () => customGet(formik.values, pathToCurrentAmount, 0),
    [formik.values, pathToCurrentAmount],
  );

  const prev = usePrevious(currentValue);

  const handleChange = useCallback(
    e => {
      const value = { name: 'base_credit', floatData: parseInt(e.target.value, 10) };

      formik.setFieldValue(pathToCurrentAmount, value);
      formik.setFieldTouched(pathToCurrentAmount);

      // update corresponding amount in other jurisdiction, if exists
      if (otherAmountPath !== '') {
        formik.setFieldValue(otherPath, value);
        formik.setFieldTouched(otherPath);
      }
    },
    [formik, pathToCurrentAmount, otherPath, otherAmountPath],
  );

  const handleDeleteUserInput = useCallback(() => {
    formik.setFieldValue(pathToUserInputs, undefined);
    formik.setFieldTouched(pathToUserInputs);

    // update corresponding amount in other jurisdiction, if exists
    if (otherAmountPath !== '') {
      formik.setFieldValue(otherPathToUserInputs, undefined);
      formik.setFieldTouched(otherPathToUserInputs);
    }
  }, [formik, otherAmountPath, otherPathToUserInputs, pathToUserInputs]);

  useEffect(() => {
    if (prev !== 0 && currentValue === 0 && whereState) {
      deleteInput({ variables: { where: whereState } });

      setWhereState(null);
    }
  }, [amount, currentValue, deleteInput, prev, whereState]);

  useEffect(() => {
    if (where && !whereState) setWhereState(where);
  }, [where, whereState]);
  return (
    <Fragment>
      <span className='form-group text-muted mb-0'>
        <span className='text-muted mb-0'>
          <p>
            <Icon name='triangle' className='mr-2' height='20' width='20' />
            This is an automatic credit. You can override the automatic value of this credit if
            necessary.
          </p>
          <p>
            The automatically calculated base value of this credit is
            {numeral(customGet(amount, `defaultInputs.0.floatData`, 0)).format(' ($0,0).')}
          </p>
        </span>

        <TextInput
          disabled={!isSubscriptionActive}
          disabledOnClick={open}
          name={`${pathToCurrentAmount}.floatData`}
          type='number'
          className='mb-0'
          prepend='dollar'
          hint='Enter an amount if you wish to override the automatic calculation, or push reset button to use the automatic value.'
          handleChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          allowZero
        />

        <LearnMoreLink to={displayInfo.reference || ''} description={displayInfo.description} />
      </span>
      {where && whereState && (
        <Button className='btn-reset' onClick={handleDeleteUserInput} loading={loading}>
          <small>Reset</small>
        </Button>
      )}
    </Fragment>
  );
};
export default connect(OverrideCreditForm);
