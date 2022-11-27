import React from 'react';

import CalculationsTypeDropdown from 'components/common/CalculationsTypeDropdown';

import PreviousCalculations from 'components/calculations/PreviousCalculations/PreviousCalculations';

const ClientCardCalculations = ({ client, isShow }) => {
  if (!isShow) return null;

  return (
    <div className='client-calculations-card'>
      <PreviousCalculations calculationsClient='Client' client={client} isHaveHeader={false} />

      <CalculationsTypeDropdown
        size='sm'
        client={client}
        clientId={client?.id}
        clientChildren={client?.children}
        headerMenuLabel='Calculations'
        className='new-calculate-dropdown'
        icon='plus'
        color='link'
        btnToggleText='New Calculation'
      />
    </div>
  );
};

export default ClientCardCalculations;
