import React, { useMemo } from 'react';

import { useLocation } from 'react-router';
import { useQuery } from '@apollo/client';

import SupportReport from 'components/calculations/SupportReport';

import useCalculationContext from 'hooks/useCalculationContext';

import SUPPORT_CALCULATION from 'graphql/queries/calculations/supportCalculaton';
import SHARED_SUPPORT_CALCULATION from 'graphql/queries/calculations/sharedSupportCalculation';

const SupportReportContainer = ({
  mutationLoading,
  isReportAvailable,
  setIsReportAvailable,
  isChanged,
  setIsChanged,
  calculation,
  showTaxes,
}) => {
  const { calculationId, type, client } = useCalculationContext();

  const loc = useLocation();
  const isSharedCalculation = useMemo(
    () => loc.pathname.includes('shared-calculation'),
    [loc.pathname],
  );

  const { data, loading } = useQuery(
    isSharedCalculation ? SHARED_SUPPORT_CALCULATION : SUPPORT_CALCULATION,
    {
      variables: { where: { id: calculationId } },
      skip: !calculationId || !client?.id,
      errorPolicy: 'all',
    },
  );

  return (
    <SupportReport
      type={type}
      showTaxes={showTaxes}
      queryLoading={loading}
      mutationLoading={mutationLoading}
      supportCalculation={calculation || data?.supportCalculation || data?.sharedSupportCalculation}
      isReportAvailable={isReportAvailable}
      setIsReportAvailable={setIsReportAvailable}
      isChanged={isChanged}
      setIsChanged={setIsChanged}
      loading={loading}
    />
  );
};

export default SupportReportContainer;
