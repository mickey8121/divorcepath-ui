import React, { useMemo } from 'react';

import { connect } from 'formik';

import ToggleButtons from 'components/common/ToggleButtons';
import LearnMoreLink from 'components/calculations/components/common/LearnMoreLink';

import useCalculationContext from 'hooks/useCalculationContext';

import get from 'utils/get';

const YukonCarbonPriceRebateForm = ({ formik, pathToAmount, displayInfo }) => {
  const { values } = formik;
  const { mutationLoading } = useCalculationContext();

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

  return (
    <div className='form-group text-muted mb-0'>
      <p className='py-2'>Do you live outside the Whitehorse area?</p>

      <ToggleButtons
        name={`${pathToAmount}.userInputs.0.stringData`}
        labelClassName='form-label'
        buttons={buttons}
        value={value || amountDefaultValue || 'false'}
        disabled={mutationLoading}
      />

      <p className='pt-2'>
        <LearnMoreLink to={displayInfo.reference || ''} description={displayInfo.description} />
      </p>
    </div>
  );
};

export default connect(YukonCarbonPriceRebateForm);
