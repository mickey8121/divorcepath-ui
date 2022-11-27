import React, { useCallback, useMemo } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'formik';

import LearnMoreLink from 'components/calculations/components/common/LearnMoreLink';
import TextInput from 'components/common/inputs/TextInput';
import { UPGRADE_PLAN_MODAL_NAME } from 'components/modals/upgrade/UpgradePlanModal';

import useCalculationContext from 'hooks/useCalculationContext';
import useModal from 'hooks/useModal';

import createPaths from 'utils/createPaths';

const OntSeniorPropertyTaxGrantForm = ({
  formik,
  hasUserInputsValues,

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

  const { path, otherPath } = useMemo(
    () => createPaths(0, hasUserInputsValues, pathToAmount, otherAmountPath),
    [hasUserInputsValues, pathToAmount, otherAmountPath],
  );

  return (
    <div className='form-group text-muted mb-0'>
      <TextInput
        label='Property Tax'
        name={path}
        type='number'
        className='mb-0'
        prepend='calendar'
        hint='Enter the total amount ($) of eligible property tax paid each year.'
        touchable
        handleChange={e => {
          formik.setFieldValue(path, parseInt(e.target.value, 10));
          formik.setFieldTouched(path);

          // update corresponding amount in other jurisdiction, if exists
          if (otherAmountPath !== '') {
            formik.setFieldValue(otherPath, parseInt(e.target.value, 10));
            formik.setFieldTouched(otherPath);
          }
        }}
        disabledOnClick={open}
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

OntSeniorPropertyTaxGrantForm.propTypes = {
  displayInfo: PropTypes.object.isRequired,
};

export default connect(OntSeniorPropertyTaxGrantForm);
