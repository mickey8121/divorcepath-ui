import React, { useCallback, Fragment, useMemo } from 'react';

import { connect } from 'formik';
import numeral from 'numeral';
import { get, isNumber } from 'lodash';

import TextInput from 'components/common/inputs/TextInput';
import LearnMoreLink from 'components/calculations/components/common/LearnMoreLink';
import { UPGRADE_PLAN_MODAL_NAME } from 'components/modals/upgrade/UpgradePlanModal';
import Button from 'components/common/Button';
import Icon from 'components/common/Icon';

import useCalculationContext from 'hooks/useCalculationContext';
import useModal from 'hooks/useModal';

const OverrideDeductionForm = ({
  formik,
  // partyType,
  // fieldType,
  index,
  setOpen,
  otherAmountPath,
  displayInfo,
  pathToAmount,
}) => {
  const { isSubscriptionActive } = useCalculationContext();
  const { open } = useModal(UPGRADE_PLAN_MODAL_NAME);

  const handleFocus = useCallback(() => setOpen({ isOpen: true, index }), [setOpen, index]);
  const handleBlur = useCallback(() => setOpen({ isOpen: false, index: null }), [setOpen]);
  const defaultAmount = useMemo(
    () => get(formik.values, pathToAmount)?.defaultAmount,
    [formik.values, pathToAmount],
  );
  const userAmount = useMemo(
    () => get(formik.values, pathToAmount)?.userAmount,
    [formik.values, pathToAmount],
  );

  const handleChangeUserAmount = useCallback(
    e => {
      const path = `${pathToAmount}.userAmount`;
      formik.setFieldValue(path, e ? parseInt(e.target.value, 10) : null);
      formik.setFieldTouched(path);

      // update corresponding amount in other jurisdiction, if exists
      if (otherAmountPath !== '') {
        const otherPath = `${otherAmountPath}.userAmount`;

        formik.setFieldValue(otherPath, e ? parseInt(e.target.value, 10) : null);
        formik.setFieldTouched(otherPath);
      }
    },
    [formik, otherAmountPath, pathToAmount],
  );

  return (
    <Fragment>
      <span className='form-group text-muted mb-0'>
        <span className='text-muted mb-0'>
          <p>
            <Icon name='triangle' className='mr-2' height='20' width='20' />
            This is an automatic deduction. You can override the automatic value of this deduction
            if necessary.
          </p>
          <p>
            The automatically calculated base value of this deduction is
            {numeral(defaultAmount).format(' ($0,0).')}
          </p>
        </span>

        <TextInput
          disabled={!isSubscriptionActive}
          disabledOnClick={open}
          name={`${pathToAmount}.userAmount`}
          type='number'
          className='mb-0'
          prepend='dollar'
          hint='Enter an amount if you wish to override the automatic calculation, or push reset button to use the automatic value.'
          handleChange={handleChangeUserAmount}
          onFocus={handleFocus}
          onBlur={handleBlur}
          allowZero
        />

        <LearnMoreLink to={displayInfo.reference || ''} description={displayInfo.description} />
      </span>

      {isNumber(userAmount) && (
        <Button className='btn-reset' onClick={() => handleChangeUserAmount()}>
          <small>Reset</small>
        </Button>
      )}
    </Fragment>
  );
};
export default connect(OverrideDeductionForm);
