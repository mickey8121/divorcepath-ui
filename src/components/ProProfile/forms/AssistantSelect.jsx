import React, { useCallback } from 'react';

import { useQuery } from '@apollo/client';
import { capitalize } from 'lodash';
import { useFormikContext } from 'formik';

import CustomSelect from 'components/common/inputs/Select/SelectField';

import getUserName from 'utils/getUserName';

import PROFESSIONALS from 'graphql/queries/organization/professionals';

export const formatAssistantOption = assistant =>
  `${getUserName(assistant)} (${capitalize(assistant?.type)})`;

const AssistantSelect = ({ onBlur }) => {
  const { setFieldValue } = useFormikContext();

  const { data } = useQuery(PROFESSIONALS, {
    variables: {
      where: {
        type: {
          in: ['ASSISTANT', 'PARALEGAL'],
        },
      },
    },
  });

  const options = data?.professionals?.map(professional => ({
    value: professional.id,
    label: formatAssistantOption(professional),
  }));

  const handleChange = useCallback(
    value => {
      if (!value) return setFieldValue('assistants', []);

      setFieldValue(
        'assistants',
        value?.map(v => ({
          key: v?.value,
          label: v?.label,
          value: v.value,
        })),
      );
    },
    [setFieldValue],
  );

  return (
    <div className='form-group select-input'>
      <CustomSelect
        isMulti
        isClearable={false}
        label='Assistants'
        name='assistants'
        size='md'
        onChange={handleChange}
        onBlur={onBlur}
        className='multi-select'
        options={options || []}
      />
    </div>
  );
};

export default AssistantSelect;
