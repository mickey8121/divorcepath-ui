import React, { useMemo } from 'react';

import { Redirect, Route } from 'react-router';

import Preloader from 'components/common/Preloader';

import IntakeAdminPanelForm from 'components/organization/intake/IntakeAdminPanelForm';

import useCurrentUser from 'hooks/useCurrentUser';
import useOrganizationQuery from 'hooks/useOrganizationQuery';

const IntakeAdminPanel = () => {
  const { me, isIntakeAdminVisible } = useCurrentUser();
  const { data, loading } = useOrganizationQuery(me?.id);

  const organization = useMemo(() => data?.organization, [data]);

  if (loading) return <Preloader />;

  if (!isIntakeAdminVisible) return <Route render={() => <Redirect to='/profile' />} />;

  return <IntakeAdminPanelForm organization={organization} />;
};

export default IntakeAdminPanel;
