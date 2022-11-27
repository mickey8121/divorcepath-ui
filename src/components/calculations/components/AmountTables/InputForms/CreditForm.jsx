import React, { useCallback } from 'react';

import { connect } from 'formik';

import LearnMoreLink from 'components/calculations/components/common/LearnMoreLink';
import TextInput from 'components/common/inputs/TextInput';
import { UPGRADE_PLAN_MODAL_NAME } from 'components/modals/upgrade/UpgradePlanModal';

import useCalculationContext from 'hooks/useCalculationContext';
import useModal from 'hooks/useModal';

const CreditForm = ({
  formik,
  // partyType,
  // fieldType,
  index,
  otherAmountPath,
  pathToAmount,
  displayInfo,
  setOpen,
}) => {
  const { isSubscriptionActive } = useCalculationContext();
  const { open } = useModal(UPGRADE_PLAN_MODAL_NAME);

  const handleFocus = useCallback(() => setOpen({ isOpen: true, index }), [setOpen, index]);
  const handleBlur = useCallback(() => setOpen({ isOpen: false, index: null }), [setOpen]);

  const handleChange = useCallback(
    event => {
      const path = `${pathToAmount}.userInputs.0.floatData`;
      formik.setFieldValue(path, parseInt(event.target.value, 10));
      formik.setFieldTouched(path);

      // update corresponding amount in other jurisdiction, if exists
      if (otherAmountPath !== '') {
        const otherPath = `${otherAmountPath}.userInputs.0.floatData`;
        formik.setFieldValue(otherPath, parseInt(event.target.value, 10));
        formik.setFieldTouched(otherPath);
      }
    },
    [formik, otherAmountPath, pathToAmount],
  );

  return (
    <div className='form-group text-muted mb-0'>
      <TextInput
        label='Base Amount'
        name={`${pathToAmount}.userInputs.0.floatData`}
        type='number'
        className='mb-0'
        prepend='dollar'
        disabledOnClick={open}
        hint='Enter the base amount (the amount claimed for this credit on the tax return).'
        touchable
        handleChange={handleChange}
        disabled={!isSubscriptionActive}
        onFocus={handleFocus}
        onBlur={handleBlur}
        allowZero
      />
      <p className='pt-2'>
        <LearnMoreLink to={displayInfo.reference || ''} description={displayInfo.description} />
      </p>
    </div>
  );
};

export default connect(CreditForm);
