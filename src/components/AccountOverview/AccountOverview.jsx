import React from 'react';

import AccountOverviewClient from 'components/AccountOverview/client/AccountOverviewClient';
import AccountOverviewPro from 'components/AccountOverview/AccountOverviewPro';

import withMe from 'context/MeContext/withMe';

const AccountOverview = ({ me }) => {
  const isLawyer = me?.professional?.id;

  if (isLawyer) return <AccountOverviewPro />;

  return <AccountOverviewClient />;
};

export default withMe(AccountOverview);
