import React, { useCallback } from 'react';

import { useQuery } from '@apollo/client';
import { useHistory, useParams } from 'react-router';
import { sortBy } from 'lodash';

import Select from 'components/common/inputs/Select/Select';

import useCalculationContext from 'hooks/useCalculationContext';

import getUserName from 'utils/getUserName';

import CLIENTS from 'graphql/queries/client/clients';

//
// get result of the CLIENTS_WITH_SUPPORT_CALCULATIONS.clients query
// return [{ value, label }]
//
const prepareOptions = clients => {
  const options = clients?.map(client => {
    const clientName = getUserName(client);

    // find recently updated calculation
    const lastUpdatedSupportCalculation = sortBy(client?.supportCalculations, 'updatedAt')?.[0];

    const optionValue = `/${
      lastUpdatedSupportCalculation?.showSpousalSupport ? 'spousal-support' : 'child-support'
    }/${
      lastUpdatedSupportCalculation
        ? `${lastUpdatedSupportCalculation?.id}/${client.id}`
        : `${client.id}/create`
    }/`;

    const calculationCount = client?.supportCalculations?.length;
    return {
      // optionValue build a whole route
      value: optionValue,
      label: `${clientName} (${calculationCount} calc)`,
    };
  });

  // eslint-disable-next-line no-unused-expressions
  options?.unshift({ label: 'New client', value: 'new' });

  return options;
};

const ClientSelectContainer = () => {
  const history = useHistory();
  const params = useParams();

  const { calculatorType } = useCalculationContext();

  const { data, loading } = useQuery(CLIENTS, {
    variables: { where: { NOT: { type: { equals: 'NOT_RETAINED' } } } },
  });

  const options = prepareOptions(loading ? [] : data?.clients);
  const activeOption = options?.find(option => option.value.includes(params.clientId));
  const defaultValue = activeOption || { label: 'New client', value: 'new' };

  const handleChange = useCallback(
    e => {
      if (e.value && e.value !== 'new') return history.push(e.value);

      return history.push(`/${calculatorType === 'CHILD' ? 'child-support' : 'spousal-support'}/`);
    },
    [calculatorType, history],
  );

  return (
    <div className='form-group custom-input select-input w-100'>
      <Select
        className='mb-4'
        name='client'
        options={options}
        value={defaultValue.value}
        onChange={handleChange}
      />
    </div>
  );
};

export default ClientSelectContainer;
