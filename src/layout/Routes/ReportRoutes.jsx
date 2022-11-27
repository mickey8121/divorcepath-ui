import React from 'react';

import { useLocation } from 'react-router';
import { useQuery } from '@apollo/client';

import DetailedSupportReportPage from 'components/calculations/SupportReport/detailed/DetailedSupportReportPage';
import CondensedSupportReportPage from 'components/calculations/SupportReport/condensed/CondensedSupportReportPage';
import SupportReportStyles from 'components/calculations/styles';

import SUPPORT_CALCULATION_BY_TOKEN from 'graphql/queries/calculations/supportCalculationByToken';

const ReportRoutes = () => {
  const { search } = useLocation();

  // Get params from paperplane request if it exists
  const urlParams = new URLSearchParams(search);
  const token = urlParams.get('token');
  // const spousal = urlParams.get('spousal');
  const reportType = urlParams.get('reportType');

  const supportCalculationId = urlParams.get('supportCalculationId');

  const { data, error } = useQuery(SUPPORT_CALCULATION_BY_TOKEN, {
    variables: { data: { supportCalculationId, token } },
  });

  if (error) {
    return <pre>{error.message}</pre>;
  }

  return (
    <SupportReportStyles>
      <div className='support-report-pages'>
        {reportType === 'condensed' ? (
          <CondensedSupportReportPage
            professional={data?.supportCalculationByToken?.professional}
            supportCalculationResult={data?.supportCalculationByToken.calculationResult}
            supportCalculation={data?.supportCalculationByToken}
          />
        ) : (
          <DetailedSupportReportPage
            professional={data?.supportCalculationByToken?.professional}
            supportCalculationResult={data?.supportCalculationByToken.calculationResult}
            supportCalculation={data?.supportCalculationByToken}
            isPaperplaneRequest
          />
        )}
      </div>
    </SupportReportStyles>
  );
};

export default ReportRoutes;
