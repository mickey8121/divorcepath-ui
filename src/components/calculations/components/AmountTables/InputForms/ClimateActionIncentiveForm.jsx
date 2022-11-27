/* eslint-disable no-shadow */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useMemo } from 'react';

import { useFormikContext } from 'formik';
import { get } from 'lodash';

import ToggleButtons from 'components/common/ToggleButtons';
import LearnMoreLink from 'components/calculations/components/common/LearnMoreLink';

import useCalculationContext from 'hooks/useCalculationContext';

import ChildrenToggleList from './forms/ChildrenToggleList';

const ClimateActionIncentiveForm = ({ partyType, displayInfo, pathToAmount, amount }) => {
  const { values, setFieldValue } = useFormikContext();

  const { mutationLoading } = useCalculationContext();

  const clientFirstName = get(values, `${partyType}.firstName`, '');

  const amountDefaultValue = useMemo(
    () => get(values, `${pathToAmount}.defaultInputs.0.stringData`),
    [values, pathToAmount],
  );

  const value = useMemo(() => {
    const stringValue = get(values, `${pathToAmount}.userInputs.0.stringData`);
    return ['true', 'false'].includes(stringValue) ? stringValue : undefined;
  }, [values, pathToAmount]);

  const buttons = useMemo(
    () => [
      {
        value: 'true',
        label: 'Yes',
      },
      {
        value: 'false',
        label: 'No',
      },
    ],
    [],
  );

  useEffect(() => {
    const currentValue = get(values, `${pathToAmount}.userInputs.0`) || {};

    if (value !== amountDefaultValue && value !== undefined && !currentValue.name) {
      setFieldValue(`${pathToAmount}.userInputs.0`, {
        ...currentValue,
        ...amount.fields?.[0],
      });
    }
    if (value === amountDefaultValue) {
      setFieldValue(`${pathToAmount}.userInputs`, undefined);
    }
  }, [amount.fields, amountDefaultValue, pathToAmount, setFieldValue, value, values]);

  return (
    <span className='form-group text-muted mb-0'>
      <LearnMoreLink to='/' description={displayInfo.description} className='mt-2' />

      <p className='py-2'>
        Do you live in a rural area eligible for the rural supplement to the Climate Action
        Incentive?
      </p>

      <ToggleButtons
        name={`${pathToAmount}.userInputs.0.stringData`}
        labelClassName='form-label'
        buttons={buttons}
        value={value || amountDefaultValue || 'false'}
        disabled={mutationLoading}
      />

      <p className='py-2'>
        {`Select which children ${clientFirstName} claims child benefits for (applies to all child benefits):`}
      </p>

      <ChildrenToggleList partyType={partyType} />
    </span>
  );
};

export default ClimateActionIncentiveForm;
