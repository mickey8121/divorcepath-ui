import React, { useCallback, useMemo, useEffect } from 'react';

import { connect } from 'formik';
import { get } from 'lodash';

import LearnMoreLink from 'components/calculations/components/common/LearnMoreLink';
import TextInput from 'components/common/inputs/TextInput';
import { UPGRADE_PLAN_MODAL_NAME } from 'components/modals/upgrade/UpgradePlanModal';

import useCalculationContext from 'hooks/useCalculationContext';
import useModal from 'hooks/useModal';

import createPaths from 'utils/createPaths';

const OtherPaymentsDeductionForm = ({
  formik,
  hasUserInputsValues,
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
    (e, path, otherPath) => {
      formik.setFieldValue(path, parseInt(e.target.value, 10));
      formik.setFieldTouched(path);

      // update corresponding amount in other jurisdiction, if exists
      if (otherAmountPath !== '') {
        formik.setFieldValue(otherPath, parseInt(e.target.value, 10));
        formik.setFieldTouched(otherPath);
      }
    },
    [formik, otherAmountPath],
  );

  useEffect(() => {
    const amount = get(formik.values, pathToAmount);

    if (
      amount?.defaultInputs?.update?.length &&
      !amount?.userInputs?.update?.length &&
      !amount?.userInputs?.create?.length
    ) {
      formik.setFieldValue(`${pathToAmount}.userInputs`, {
        create: amount?.defaultInputs?.update?.map(
          ({ data: { name, floatData, childrenArray, stringData } }) => ({
            name,
            floatData,
            stringData,
            childrenArray: childrenArray?.length > 0 ? { set: childrenArray } : void 0,
          }),
        ),
      });
    }
  }, [pathToAmount, formik]);

  const inputs = useMemo(
    () => [
      {
        label: 'WCB Income',
        prepend: 'calendar',
        hint: "Enter the total amount ($) of all WCB (workers' compensation board) income for the year.",
        ...createPaths(0, hasUserInputsValues, pathToAmount, otherAmountPath),
      },
      {
        label: 'Social Assistance Income',
        hint: 'Enter the total amount ($) of all government social assistance income for the year.',
        ...createPaths(1, hasUserInputsValues, pathToAmount, otherAmountPath),
      },
      {
        label: 'Net Federal Supplements',
        hint: 'Enter the total amount ($) of net federal supplements for the year.',
        ...createPaths(2, hasUserInputsValues, pathToAmount, otherAmountPath),
      },
    ],
    [hasUserInputsValues, pathToAmount, otherAmountPath],
  );

  return (
    <div className='form-group text-muted mb-0'>
      {inputs.map(({ label, prepend, hint, ...paths }) => (
        <TextInput
          key={label}
          type='number'
          className='mb-0'
          label={label}
          disabledOnClick={open}
          name={paths.path}
          prepend={prepend || 'dollar'}
          hint={hint}
          touchable
          handleChange={e => handleChange(e, paths.path, paths.otherPath)}
          disabled={!isSubscriptionActive}
          onFocus={handleFocus}
          onBlur={handleBlur}
          allowZero
        />
      ))}

      <p className='pt-2'>
        <LearnMoreLink to={displayInfo.reference || ''} description={displayInfo.description} />
      </p>
    </div>
  );
};

export default connect(OtherPaymentsDeductionForm);
