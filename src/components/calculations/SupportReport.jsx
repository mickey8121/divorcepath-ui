import React, { useMemo } from 'react';

import Preloader from 'components/common/Preloader';

import CardHeader from 'components/calculations/components/CardHeader';
import CalculateButtons from 'components/calculations/CalculateButtons';
import ResultSection from 'components/calculations/sections/result/ResultSection';

import useCalculationContext from 'hooks/useCalculationContext';

const SupportReport = ({
  queryLoading,
  mutationLoading,
  isChanged,
  supportCalculation,
  isReportAvailable,
  setIsReportAvailable,
  loading,
  setIsChanged,
  showTaxes,
}) => {
  const { type } = useCalculationContext();

  const isCalculated = !!supportCalculation?.calculationResult;

  const resultsSectionCount = useMemo(
    () => (type === 'create' && !showTaxes ? 5 : 6),
    [type, showTaxes],
  );

  const { personPronoun } = useCalculationContext();

  return (
    <div
      className={`calculator-section-container ${mutationLoading ? 'loading' : ''}`}
      id='results'
      name='#results'
    >
      <CardHeader
        src='./img/icons/dusk/png/teacher-hiring.png'
        text={`${resultsSectionCount}. Results`}
      />

      {queryLoading && (
        <div className='p-4'>
          <Preloader type='query' />
        </div>
      )}
      {((!queryLoading && !isCalculated) || isChanged) && (
        <React.Fragment>
          <div className='p-4'>
            Click the "calculate" button to run the calculation and view {personPronoun.your}
            results. By clicking "Calculate" you confirm that you have reviewed and accepted the
            <a href='https://www.divorcepath.com/terms'>&nbsp;terms of use</a> and
            <a href='https://www.divorcepath.com/privacy'>&nbsp;privacy policy</a>.
          </div>
          <CalculateButtons
            supportCalculation={supportCalculation}
            loading={loading}
            queryLoading={queryLoading}
            setIsChanged={setIsChanged}
            isChanged={isChanged}
            sidebar={false}
          />
          <p className='ml-4'>
            For more information on how support is calculated, visit the
            <a href='https://www.divorcepath.com/help' target='_new'>
              &nbsp;help centre
            </a>
            .
          </p>
        </React.Fragment>
      )}

      {!queryLoading && isCalculated && !isChanged && (
        <div name='#results' id='results'>
          <ResultSection
            supportCalculation={supportCalculation}
            isReportAvailable={isReportAvailable}
            setIsReportAvailable={setIsReportAvailable}
            showTaxes={showTaxes}
          />
        </div>
      )}
    </div>
  );
};

export default SupportReport;
