import React, { useCallback, useState } from 'react';

import classnames from 'classnames';

import ClientDropdown from 'components/clients/ClientDropdown';

const ClientButtonsContainer = ({ ...props }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return (
    <div className={classnames('client-buttons-container', { show: isOpen })}>
      <ClientDropdown
        size='md'
        headerMenuLabel='Calculations'
        btnToggleText='Client Actions'
        isOpen={isOpen}
        toggle={toggle}
        {...props}
      />
    </div>
  );
};

export default ClientButtonsContainer;
