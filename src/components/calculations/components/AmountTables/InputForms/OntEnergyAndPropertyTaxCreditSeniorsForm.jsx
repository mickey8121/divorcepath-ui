import React, { useCallback, useMemo, useEffect } from 'react';

import { connect } from 'formik';
import { get } from 'lodash';

import LearnMoreLink from 'components/calculations/components/common/LearnMoreLink';
import TextInput from 'components/common/inputs/TextInput';
import { UPGRADE_PLAN_MODAL_NAME } from 'components/modals/upgrade/UpgradePlanModal';

import useCalculationContext from 'hooks/useCalculationContext';
import useModal from 'hooks/useModal';

import createPaths from 'utils/createPaths';

const OntEnergyAndPropertyTaxCreditSeniorsForm = ({
  formik,
  index,
  otherAmountPath,
  pathToAmount,
  displayInfo,
  setOpen,
}) => {
  const { values, setFieldValue, setFieldTouched } = formik;
  const { isSubscriptionActive } = useCalculationContext();
  const { open } = useModal(UPGRADE_PLAN_MODAL_NAME);

  const handleFocus = useCallback(() => setOpen({ isOpen: true, index }), [setOpen, index]);
  const handleBlur = useCallback(() => setOpen({ isOpen: false, index: null }), [setOpen]);

  const hasUserInputs = useMemo(() => {
    const amount = get(values, pathToAmount);
    return amount?.userInputs?.update?.length > 0 || amount?.userInputs?.create?.length > 0;
  }, [pathToAmount, values]);

  useEffect(() => {
    const amount = get(values, pathToAmount);

    if (
      amount?.defaultInputs?.update?.length &&
      !amount?.userInputs?.update?.length &&
      !amount?.userInputs?.create?.length
    ) {
      setFieldValue(`${pathToAmount}.userInputs`, {
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
  }, [values, pathToAmount, setFieldValue]);

  const handleChange = useCallback(
    (e, path, otherPath) => {
      setFieldValue(path, parseInt(e.target.value, 10));
      setFieldTouched(path);

      // update corresponding amount in other jurisdiction, if exists
      if (otherAmountPath !== '') {
        setFieldValue(otherPath, parseInt(e.target.value, 10));
        setFieldTouched(otherPath);
      }
    },
    [setFieldValue, setFieldTouched, otherAmountPath],
  );

  const inputs = useMemo(
    () => [
      {
        label: 'Property Tax (Own Residence)',
        prepend: 'calendar',
        hint: 'Enter the total amount ($) of eligible property tax paid by this person each year for their own residence.',
        ...createPaths(
          0,
          hasUserInputs,
          pathToAmount,
          otherAmountPath,
          values,
          'property_tax_own_residence',
        ),
      },
      {
        label: "Property Tax (Other's Residence)",
        hint: "Enter the total amount ($) of all eligible property tax paid by this person each year for another eligible person's residence.",
        ...createPaths(
          1,
          hasUserInputs,
          pathToAmount,
          otherAmountPath,
          values,
          'property_tax_other',
        ),
      },
      {
        label: 'Rent',
        hint: 'Enter the total amount ($) of rent paid by this person each year.',
        ...createPaths(2, hasUserInputs, pathToAmount, otherAmountPath, values, 'rent'),
      },
      {
        label: 'Energy Costs',
        hint: 'Enter the total amount ($) paid for eligible long term care costs by this person each year.',
        ...createPaths(3, hasUserInputs, pathToAmount, otherAmountPath, values, 'energy_amount'),
      },
      {
        label: 'Long Term Care Cost',
        hint: 'Enter the total amount ($) paid for eligible occupancy expenses by this person each year.',
        ...createPaths(
          4,
          hasUserInputs,
          pathToAmount,
          otherAmountPath,
          values,
          'long_term_care_cost',
        ),
      },
    ],
    [hasUserInputs, pathToAmount, otherAmountPath, values],
  );

  return (
    <div className='form-group text-muted mb-0'>
      {inputs.map(({ label, prepend, hint, ...paths }) => (
        <TextInput
          key={label}
          type='number'
          className='mb-0'
          label={label}
          name={paths.path}
          prepend={prepend || 'dollar'}
          hint={hint}
          disabledOnClick={open}
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

export default connect(OntEnergyAndPropertyTaxCreditSeniorsForm);
