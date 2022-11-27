import React, { useCallback, useMemo, Fragment, useEffect } from 'react';

import { connect } from 'formik';
import { get } from 'lodash';

import TextInput from 'components/common/inputs/TextInput';
import LearnMoreLink from 'components/calculations/components/common/LearnMoreLink';
import { UPGRADE_PLAN_MODAL_NAME } from 'components/modals/upgrade/UpgradePlanModal';

import useCalculationContext from 'hooks/useCalculationContext';
import useModal from 'hooks/useModal';

import createPaths from 'utils/createPaths';

const NorthernResidentsForm = ({
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
  const { values } = formik;

  const handleFocus = useCallback(() => setOpen({ isOpen: true, index }), [setOpen, index]);
  const handleBlur = useCallback(() => setOpen({ isOpen: false, index: null }), [setOpen]);

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
  }, [formik, pathToAmount]);

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

  const inputs = useMemo(
    () => [
      {
        title: 'Expenses for Residency in Northern Regions:',
        label: 'Basic Residency',
        prepend: 'calendar',
        hint: 'Enter the number of days per year (0 to 365) in which this person is resident in a northern region.',
        ...createPaths(
          0,
          hasUserInputsValues,
          pathToAmount,
          otherAmountPath,
          values,
          'basic_residency',
        ),
      },
      {
        label: 'Basic Travel',
        prepend: 'dollar',
        hint: 'Enter the amount ($) of eligible travel expenses incurred to travel to an eligible northern region.',
        ...createPaths(
          1,
          hasUserInputsValues,
          pathToAmount,
          otherAmountPath,
          values,
          'basic_travel',
        ),
      },
      {
        label: 'Basic Lodging',
        prepend: 'dollar',
        hint: 'Enter the amount ($) of eligible lodging expenses incurred to temporarily reside in an eligible northern region.',
        ...createPaths(
          2,
          hasUserInputsValues,
          pathToAmount,
          otherAmountPath,
          values,
          'basic_lodging',
        ),
      },
      {
        title: 'Expenses for Residency in Intermediate Northern Regions:',
        label: 'Intermediate Residency',
        prepend: 'calendar',
        hint: 'Enter the number of days per year (0 to 365) in which this person is resident in an intermediate northern region. The total of basic northern residency days and intermediate days cannot exceed 365.',
        ...createPaths(
          3,
          hasUserInputsValues,
          pathToAmount,
          otherAmountPath,
          values,
          'intermediate_residency',
        ),
      },
      {
        label: 'Intermediate Travel',
        prepend: 'dollar',
        hint: 'Enter the amount ($) of eligible travel expenses incurred to travel to an eligible intermediate northern region.',
        ...createPaths(
          4,
          hasUserInputsValues,
          pathToAmount,
          otherAmountPath,
          values,
          'intermediate_travel',
        ),
      },
      {
        label: 'Intermediate Lodging',
        prepend: 'dollar',
        hint: 'Enter the amount ($) of eligible lodging expenses incurred to temporarily reside in an eligible intermediate northern region.',
        ...createPaths(
          5,
          hasUserInputsValues,
          pathToAmount,
          otherAmountPath,
          values,
          'intermediate_lodging',
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <div className='form-group text-muted mb-0'>
      <LearnMoreLink to={displayInfo.reference || ''} description={displayInfo.description} />

      {inputs.map(({ label, prepend, hint, title, defaultValue, ...paths }) => (
        <Fragment key={label}>
          {title && (
            <Fragment>
              <hr />
              <h6 className='text-dark'>{title}</h6>
            </Fragment>
          )}
          <TextInput
            type='number'
            className='mb-0'
            label={label}
            name={paths.path}
            value={get(formik.values, paths.path) || get(formik.values, defaultValue)}
            prepend={prepend}
            hint={hint}
            touchable
            handleChange={e => handleChange(e, paths.path, paths.otherPath)}
            disabled={!isSubscriptionActive}
            disabledOnClick={open}
            onFocus={handleFocus}
            onBlur={handleBlur}
            allowZero
          />
        </Fragment>
      ))}
    </div>
  );
};

export default connect(NorthernResidentsForm);
