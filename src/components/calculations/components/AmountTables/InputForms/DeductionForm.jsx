import React, { useCallback } from 'react';

import { connect } from 'formik';
import PropTypes from 'prop-types';

import TextInput from 'components/common/inputs/TextInput';
import LearnMoreLink from 'components/calculations/components/common/LearnMoreLink';
import { UPGRADE_PLAN_MODAL_NAME } from 'components/modals/upgrade/UpgradePlanModal';

import useCalculationContext from 'hooks/useCalculationContext';
import useModal from 'hooks/useModal';

const DeductionForm = ({
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

  return (
    <span className='form-group text-muted mb-0'>
      <TextInput
        label='Deduction Amount'
        name={`${pathToAmount}.userAmount`}
        type='number'
        className='mb-0'
        prepend='dollar'
        disabledOnClick={open}
        hint='Enter the deduction amount (the amount claimed for this deduction on the tax return).'
        handleChange={e => {
          const path = `${pathToAmount}.userAmount`;
          formik.setFieldValue(path, parseInt(e.target.value, 10));
          formik.setFieldTouched(path);

          // update corresponding amount in other jurisdiction, if exists
          if (otherAmountPath !== '') {
            const otherPath = `${otherAmountPath}.userAmount`;

            formik.setFieldValue(otherPath, parseInt(e.target.value, 10));
            formik.setFieldTouched(otherPath);
          }
        }}
        disabled={!isSubscriptionActive}
        onFocus={handleFocus}
        onBlur={handleBlur}
        allowZero
      />

      <LearnMoreLink description={displayInfo.description} to={displayInfo.reference || ''} />
    </span>
  );
};

DeductionForm.propTypes = {
  displayInfo: PropTypes.object.isRequired,
};

export default connect(DeductionForm);
