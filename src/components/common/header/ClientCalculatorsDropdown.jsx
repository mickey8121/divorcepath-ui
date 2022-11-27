import React, { useMemo } from 'react';

import { useLocation } from 'react-router';

import CalculationsTypeDropdown from 'components/common/CalculationsTypeDropdown';

import useCurrentUser from 'hooks/useCurrentUser';

const ClientCalculatorsDropdown = ({ isPro }) => {
  const { me } = useCurrentUser();

  const { pathname } = useLocation();

  const clientChildren = useMemo(() => me?.client?.children, [me]);

  const isActive = useMemo(
    () => pathname.includes('child-support') || pathname.includes('spousal-support'),
    [pathname],
  );

  return (
    <CalculationsTypeDropdown
      header
      client={me?.client}
      clientChildren={clientChildren}
      icon='calculator'
      size='lg'
      color='secondary'
      headerMenuLabel='Support Calculators'
      btnToggleText='Calculators'
      right={!isPro}
      active={isActive}
    />
  );
};

export default ClientCalculatorsDropdown;
