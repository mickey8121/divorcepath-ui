import React, { useMemo } from 'react';

import { connect } from 'formik';

import LearnMoreLink from 'components/calculations/components/common/LearnMoreLink';
import ToggleButtons from 'components/common/ToggleButtons';

import useCalculationContext from 'hooks/useCalculationContext';

import get from 'utils/get';

const NorthernOntarioEnergyCreditForm = ({ formik, pathToAmount, displayInfo }) => {
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
    <div className='form-group mb-0'>
      <p className='py-2'>
        <strong>Live in Northern Ontario?</strong>
      </p>
      <p className='py-2 text-muted font-italic'>
        Includes districts of Algoma, Cochrane, Kenora, Manitoulin, Nipissing, Parry Sound, Rainy
        River, Sudbury, Thunder Bay or Timiskaming.
      </p>

      <ToggleButtons
        name={`${pathToAmount}.userInputs.0.stringData`}
        labelClassName='form-label'
        buttons={buttons}
        value={value || amountDefaultValue || 'false'}
        disabled={mutationLoading}
      />

      <p className='pt-2 text-muted '>
        <LearnMoreLink to={displayInfo.reference || ''} description={displayInfo.description} />
      </p>
    </div>
  );
};

export default connect(NorthernOntarioEnergyCreditForm);
