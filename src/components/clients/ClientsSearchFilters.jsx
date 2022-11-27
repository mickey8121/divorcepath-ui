import React from 'react';

import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

import useClientsCount from 'hooks/useClientsCount';
import useCurrentUser from 'hooks/useCurrentUser';

import { filters, getFilterCountersWhere } from 'helpers/filters';

const filterButtons = [
  {
    value: filters.YOUR_CLIENTS,
    text: 'Your Clients',
  },
  {
    value: filters.POTENTIAL_CLIENTS,
    text: 'Potential Clients',
  },
  {
    value: filters.ALL_FIRM_CLIENTS,
    text: 'All Firm Clients',
  },
];

const ClientsSearchFilters = ({ filter, disabled, onChange, defaultFilter }) => {
  const {
    me: {
      professional: { id },
    },
  } = useCurrentUser();

  const where = getFilterCountersWhere(id);

  const { data } = useClientsCount(where);
  const counts = data?.clientsCount?.counts;

  return (
    <ToggleButtonGroup
      className='custom-filter-group mx-3 mb-4'
      type='radio'
      name='options'
      defaultValue={defaultFilter}
      value={filter}
      onChange={onChange}
    >
      {filterButtons.map(({ value, text }, index) => (
        <ToggleButton
          className='custom-filter-btn btn-default'
          key={value}
          value={value}
          variant='outline-primary'
          name='filter'
          disabled={disabled && filter !== value}
        >
          {text} {counts && <span className='count-badge'>{counts[index]}</span>}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default ClientsSearchFilters;
