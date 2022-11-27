import React, { Fragment, useEffect, useMemo } from 'react';

import { useLocation, Route } from 'react-router-dom';
import { scroller } from 'react-scroll';

import BackgroundForm from 'components/ClientProfile/forms/BackgroundForm';
import AddressForm from 'components/ClientProfile/forms/AddressForm';
import ChildrenForm from 'components/ClientProfile/forms/children/ChildrenForm';
import Relationship from 'components/ClientProfile/forms/Relationship';
import ExBackgroundForm from 'components/ClientProfile/forms/ExBackgroundForm';
import ExAddressForm from 'components/ClientProfile/forms/ExAddressForm';
import SettingsForm from 'components/ClientProfile/settingsForm/SettingsForm';
import Matter from 'components/ClientProfile/forms/Matter';
import ChooseBillingPlan from 'components/billing/ChooseBillingPlan';

import usePrevValue from 'hooks/usePrevValue';
import useWindowSize from 'hooks/useWindowSize';

export const ClientProfileRoutes = ({ pathname, pathnameLink, updateUser, isClient, user }) => {
  const { pathname: locationPathname, state } = useLocation();

  const prevPathname = usePrevValue(locationPathname);

  const { isMobileView } = useWindowSize();

  const type = useMemo(
    () => (locationPathname.includes('clients') ? 'client' : 'user'),
    [locationPathname],
  );

  useEffect(() => {
    if (
      (prevPathname !== locationPathname || locationPathname.includes('/background')) &&
      isMobileView
    ) {
      setTimeout(
        () =>
          scroller.scrollTo('form', {
            duration: 500,
            smooth: 'easeInOutQuart',
            offset: -20,
          }),
        0,
      );
    }
  }, [state, locationPathname, prevPathname, isMobileView]);

  const routes = useMemo(
    () => [
      {
        path: 'billing',
        component: () => (isClient ? <ChooseBillingPlan /> : null),
      },
      {
        path: 'settings',
        component: () => (isClient ? <SettingsForm /> : null),
      },
      {
        path: 'background',
        component: () => (
          <BackgroundForm
            updateUser={updateUser(`${pathnameLink}/address`)}
            user={user}
            isRoleClient={isClient}
          />
        ),
      },
      {
        path: 'address',
        component: () => (
          <AddressForm
            updateUser={updateUser(`${pathnameLink}/children`)}
            user={user}
            isRoleClient={isClient}
          />
        ),
      },
      {
        path: 'children',
        component: () => (
          <ChildrenForm
            updateUser={updateUser(`${pathnameLink}/relationship`)}
            user={user}
            isRoleClient={isClient}
          />
        ),
      },
      {
        path: 'relationship',
        component: () => (
          <Relationship
            updateUser={updateUser(`${pathnameLink}/exBackground`)}
            user={user}
            isRoleClient={isClient}
          />
        ),
      },
      {
        path: 'exBackground',
        component: () => (
          <ExBackgroundForm
            updateUser={updateUser(`${pathnameLink}/exAddress`)}
            user={user}
            isRoleClient={isClient}
          />
        ),
      },
      {
        path: 'exAddress',
        component: () => (
          <ExAddressForm
            updateUser={updateUser(type === 'user' ? '/' : `${pathnameLink}/matter`)}
            user={user}
            isRoleClient={isClient}
          />
        ),
      },
      {
        path: 'matter',
        component: () => (isClient ? null : <Matter updateUser={updateUser()} user={user} />),
      },
    ],
    [user, isClient, pathnameLink, updateUser, type],
  );

  return (
    <Fragment>
      {routes.map(({ path, component }) => (
        <Route key={path} path={`${pathname}/${path}`} component={component} />
      ))}
    </Fragment>
  );
};

export default ClientProfileRoutes;
