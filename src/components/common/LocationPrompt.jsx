import React, { useMemo, useCallback } from 'react';

import { Prompt, useLocation } from 'react-router';

import difference from 'components/calculations/utils/difference';

import useCurrentUser from 'hooks/useCurrentUser';
import useCalculationContext from 'hooks/useCalculationContext';

import matchPath from 'utils/matchPath';

const LocationPrompt = ({ initialValues, values }) => {
  const { pathname } = useLocation();
  const { isPro } = useCurrentUser();
  const { calculatorType } = useCalculationContext() || {};

  const isBlocking = useMemo(() => {
    const diff = difference(values, initialValues);

    return !!Object.keys(diff)?.length;
  }, [initialValues, values]);

  const onRouteChange = useCallback(
    location => {
      if (pathname === location.pathname && location.hash) return true;
      const childSupport = calculatorType === 'CHILD' ? '/child-support' : null;
      const spousalSupport = calculatorType === 'SPOUSAL' ? '/spousal-support' : null;

      if (childSupport || spousalSupport) {
        const path = isPro
          ? `${childSupport || spousalSupport}/:calculationId/:clientId`
          : `${childSupport || spousalSupport}/:calculationId`;

        const matchedPath = matchPath(location.pathname, path);
        const initialPathnameParams = matchPath(pathname, path);

        const id = isPro ? matchedPath?.params?.clientId : matchedPath?.params?.calculationId;

        if (
          !Object.keys(initialPathnameParams?.params || {})?.length &&
          Object.keys(matchedPath?.params || {})?.length === 2
        ) {
          return true;
        }
        if (!isPro && matchedPath?.params?.calculationId) return true;
        if (pathname.includes('/create') && id && !location.pathname.includes('/create')) {
          return true;
        }
      }

      return 'You have unsaved changes. Are you sure you want to leave the page?';
    },
    [pathname, isPro, calculatorType],
  );

  return <Prompt when={isBlocking} message={onRouteChange} />;
};

export default LocationPrompt;
