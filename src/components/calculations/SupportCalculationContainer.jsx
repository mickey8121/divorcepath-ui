import React, { Fragment, useMemo, useState, useCallback } from 'react';

import { useLocation, useParams } from 'react-router';
import { useQuery } from '@apollo/client';
import { Helmet } from 'react-helmet';

import SupportCalculation from 'components/calculations/SupportCalculation';
import Info from 'components/calculations/Info';

import useCurrentUser from 'hooks/useCurrentUser';

import CalculationContextProvider from 'context/CalculationContext/CalculationContextProvider';

import checkIsProPlan from 'utils/checkIsProPlan';

import CLIENT from 'graphql/queries/client/client';
import SUPPORT_CALCULATION from 'graphql/queries/calculations/supportCalculaton';
import SHARED_SUPPORT_CALCULATION from 'graphql/queries/calculations/sharedSupportCalculation';

const SupportCalculationContainer = () => {
  return (
    <Fragment>
      {process.env.NODE_ENV === 'development' && <Info />}
      <SupportCalculation />
    </Fragment>
  );
};

const ContainerWithContext = () => {
  const loc = useLocation();
  const { calculationId, clientId } = useParams();

  const isSharedCalculation = useMemo(
    () => loc.pathname.includes('shared-calculation'),
    [loc.pathname],
  );

  const { data, loading: supportCalculationLoading } = useQuery(
    isSharedCalculation ? SHARED_SUPPORT_CALCULATION : SUPPORT_CALCULATION,
    {
      variables: { where: { id: calculationId } },
      skip: !calculationId,
      errorPolicy: 'all',
    },
  );

  const calculatorType = loc.pathname.includes('/spousal-support') ? 'SPOUSAL' : 'CHILD';

  const { me, isActiveSub } = useCurrentUser();

  const variables = useMemo(() => ({ where: { id: clientId } }), [clientId]);
  const { data: clientData } = useQuery(CLIENT, { variables, skip: !clientId });

  const [isProfessional, setIsProfessional] = useState(checkIsProPlan(me));

  const planId = useMemo(() => me?.subscription?.plan?.id, [me]);
  const subscriptionType = useMemo(() => {
    if (planId?.includes('PRO')) return 'PRO';
    if (planId?.includes('FIRM') || me?.professional?.organization?.subscriptionType) return 'FIRM';
    if (planId?.includes('SPOUSAL')) return 'SPOUSAL';
    if (planId?.includes('CHILD')) return 'CHILD';
    if (planId?.includes('SOLO')) return 'SOLO';

    return false;
  }, [me, planId]);

  const isActionAllowed = useMemo(
    () =>
      (isActiveSub && isProfessional) ||
      (isProfessional && subscriptionType === 'FIRM') ||
      subscriptionType === 'SPOUSAL' ||
      calculatorType === 'CHILD',
    [calculatorType, isProfessional, isActiveSub, subscriptionType],
  );

  const type = useMemo(() => (calculationId ? 'update' : 'create'), [calculationId]);

  const personPronoun = useMemo(
    () =>
      isProfessional
        ? { you: ' client ', your: ' your client ' }
        : { you: ' you ', your: ' your ' },
    [isProfessional],
  );

  const pageTitle =
    calculatorType === 'SPOUSAL'
      ? '[2022] Spousal Support Calculator - Divorcepath.ca'
      : '[2022] Child Support Calculator - Divorcepath.ca';

  const pageDescription =
    calculatorType === 'SPOUSAL'
      ? 'Calculate spousal support and save a courtroom-ready support report. Easy-to-use professional support calculator.'
      : 'Calculate child support and create a report for court or mediation. Run your own support calculations and save legal fees.';

  const pageUrl = calculatorType === 'SPOUSAL' ? 'spousal-support' : 'child-support';

  const handleCalcCheckboxChange = useCallback(
    () =>
      setIsProfessional(prev => {
        localStorage.setItem('isProfessional', !prev);

        return !prev;
      }),
    [],
  );

  return (
    <React.Fragment>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name='description' content={pageDescription} />
        <link href={`https://www.divorcepath.com/app/${pageUrl}/`} rel='canonical' />
      </Helmet>
      <CalculationContextProvider
        value={{
          supportCalculation: isSharedCalculation
            ? data?.sharedSupportCalculation
            : data?.supportCalculation,
          supportCalculationLoading,

          calculationId,
          calculatorType,
          client: clientData ? clientData?.client : me?.client,
          isActionAllowed,
          isProfessional,
          isSubscriptionActive: isActiveSub,
          planId,
          subscriptionType,
          type,

          handleCalcCheckboxChange,
          personPronoun,
          clientId,

          isSharedCalculation,
        }}
      >
        <SupportCalculationContainer />
      </CalculationContextProvider>
    </React.Fragment>
  );
};

export default ContainerWithContext;
