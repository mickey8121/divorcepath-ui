import React, { useCallback, useMemo } from 'react';

import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import { useFormikContext } from 'formik';

import ToggleButtons from 'components/common/ToggleButtons';

import { fillChildren } from 'components/calculations/utils/initialValues';
import { defaultChildren } from 'components/calculations/utils/defaultValues';

import useCalculationContext from 'hooks/useCalculationContext';

const OptionsChildrenToggle = () => {
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const { calculatorType, isProfessional, client, calculationId, type } = useCalculationContext();

  const createChildren = useCallback(() => {
    const defaultChildrenForCreate = {
      ...defaultChildren,
      firstName: 'Child 1',
      id: uuidv4(),
    };

    const children = client?.children?.length ? client?.children : [defaultChildrenForCreate];

    setFieldValue('children', fillChildren(children, type));
    setFieldTouched('children', true);

    setFieldTouched('hasChildren', true);
    setFieldValue('showChildSupport', true);
    setFieldValue('hasChildren', true);
  }, [client, setFieldTouched, setFieldValue, type]);

  const childrenButtons = useMemo(
    () => [
      {
        value: true,
        label: 'Yes',
        onClick: createChildren,
      },
      {
        value: false,
        label: 'No',
      },
    ],
    [createChildren],
  );

  const HintComponent = useCallback(() => {
    if (calculatorType !== 'CHILD') return null;

    const path = isProfessional
      ? `/spousal-support/${client?.id}/${calculationId || 'create'}`
      : `/spousal-support/${calculationId || ''}`;

    return (
      <p className='mb-0 mt-1 small'>
        <span>Calculate spousal support without children using the </span>
        <Link to={path}>spousal support calculator.</Link>
      </p>
    );
  }, [calculatorType, client, calculationId, isProfessional]);

  return (
    <ToggleButtons
      label={isProfessional ? `Does your client have children?` : 'Do you have children ?'}
      name='hasChildren'
      disabled={calculatorType === 'CHILD'}
      buttons={childrenButtons}
      hintComponent={<HintComponent />}
    />
  );
};

export default OptionsChildrenToggle;
