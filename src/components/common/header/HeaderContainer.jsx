import React, { useMemo } from 'react';

import Header from 'components/common/header/Header';

import useCurrentUser from 'hooks/useCurrentUser';

const HeaderContainer = () => {
  const { me, isFreeSub } = useCurrentUser();

  const loading = false;
  const name = useMemo(
    () => me?.client?.profile?.firstName || me?.professional?.profile?.firstName || me?.email,
    [me],
  );

  const isClientHasName = useMemo(
    () => me?.client?.profile?.firstName && me?.client?.profile?.lastName,
    [me],
  );

  const isProffessional = useMemo(() => me?.professional?.id, [me]);

  return (
    <Header
      isProffessional={isProffessional}
      name={name}
      loading={loading}
      isFreeSub={isFreeSub}
      isClientHasName={isClientHasName}
    />
  );
};

export default HeaderContainer;
