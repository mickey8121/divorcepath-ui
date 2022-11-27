/* eslint-disable no-negated-condition */
import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { useParams, useHistory } from 'react-router';
import { useQuery, useMutation } from '@apollo/client';
import { usePrevious } from 'react-delta';
import { toast } from 'react-toastify';
import classnames from 'classnames';

import Select from 'components/common/inputs/Select/Select';

import { reportTypes } from 'components/calculations/utils/constants';
import GeneratePDFButton from 'components/calculations/SupportReport/components/GeneratePDF/GeneratePDFButton';

import useCalculationContext from 'hooks/useCalculationContext';

import GENERATE_PDF from 'graphql/mutations/calculations/generatePDF';
import GET_PDF from 'graphql/queries/calculations/getPDF';

const GeneratePDFButtonContainer = ({
  isOpen,
  isSubActive,
  propsCalculationId,
  className,
  isReportAvailable,
  setIsReportAvailable,
  isCalculationCard,
  children,
}) => {
  const { isSubscriptionActive } = useCalculationContext();

  const { push } = useHistory();

  const [clicked, setClicked] = useState(false);
  const [reportType, setReportType] = useState('detailed');

  // use calculationId from props when provided, e.g. when this component displayed in the previous calculations list
  // otherwise get calculationId from params
  const { calculationId } = useParams();

  const supportCalculationId = useMemo(
    () => propsCalculationId || calculationId,
    [propsCalculationId, calculationId],
  );

  const variables = useMemo(
    () => ({ data: { supportCalculationId, reportType: reportType.toUpperCase() } }),
    [supportCalculationId, reportType],
  );

  const [generatePDF] = useMutation(GENERATE_PDF);

  const {
    data,
    loading,
    variables: prevVariables,
  } = useQuery(GET_PDF, {
    variables,
    skip: supportCalculationId === void 0 || (propsCalculationId && !isOpen),
    pollInterval: clicked ? 1000 : 0,
    // We are using cache-first here because when user recalculates
    // we delete existing pdfUrl from Apollo cache to turn generate button back to
    // Generate PDF
    fetchPolicy: 'cache-first',
  });

  const prevData = usePrevious(data);

  const [pdfUrl, setPdfUrl] = useState({
    detailed: data?.getPDF?.pdfUrl,
    condensed: undefined,
  });

  useEffect(() => {
    if (
      !pdfUrl[reportType] &&
      data?.getPDF?.pdfUrl &&
      prevVariables.data.reportType === reportType.toUpperCase() &&
      data?.getPDF?.pdfUrl?.toLowerCase().includes(reportType)
    ) {
      setPdfUrl(prev => ({
        ...prev,
        [reportType]: data?.getPDF?.pdfUrl,
      }));
    }
  }, [pdfUrl, data, prevVariables, reportType]);

  useEffect(() => {
    setTimeout(() => {
      setPdfUrl({
        detailed: undefined,
        condensed: undefined,
      });
    }, 100);
  }, []);

  useEffect(() => {
    // If report was loaded from DB we allow to download it right after page load

    if (
      !prevData?.getPDF?.pdfUrl?.[reportType] &&
      data?.getPDF?.pdfUrl?.[reportType] &&
      setIsReportAvailable
    ) {
      setIsReportAvailable(true);
    }

    if (clicked && pdfUrl[reportType]) {
      setClicked(false);
      window.open(pdfUrl[reportType]);
    }
  }, [clicked, pdfUrl, prevData, data, setIsReportAvailable, reportType]);

  const active = useMemo(
    () => isSubActive || isSubscriptionActive,
    [isSubActive, isSubscriptionActive],
  );

  const handleGeneratePDF = useCallback(() => {
    setClicked(true);

    generatePDF({ variables })
      .then(() => {})
      .catch(err => toast.error(err && err.message));
  }, [generatePDF, variables]);

  const handleClick = useCallback(() => {
    if (pdfUrl[reportType]) window.open(pdfUrl[reportType]);
    else handleGeneratePDF();
  }, [handleGeneratePDF, pdfUrl, reportType]);

  const btnClickHandler = useCallback(() => {
    if (active) return handleClick();

    return push('/plans');
  }, [active, handleClick, push]);

  const text = useMemo(() => {
    if (active) {
      if (pdfUrl[reportType]) return 'View PDF';
      return 'Generate PDF';
    }

    return 'Upgrade';
  }, [active, pdfUrl, reportType]);

  const showDescription = useMemo(
    () => !isCalculationCard && !isReportAvailable,
    [isCalculationCard, isReportAvailable],
  );

  const reportByReportType = useMemo(() => reportTypes[reportType] || {}, [reportType]);

  return (
    <div className={classnames('generate-pdf', className)}>
      <img
        src={reportByReportType.thumbnail}
        alt={reportByReportType.title}
        className='report-type-img d-none d-sm-inline'
        width='258'
        height='307'
      />
      <div className='generate-btn-container'>
        <div className='select-container'>
          <Select
            size='md'
            label='Type'
            isDisabled={clicked}
            options={[
              { value: 'detailed', label: 'Detailed Report' },
              { value: 'condensed', label: 'Condensed Report' },
            ]}
            value={reportType}
            onChange={({ value }) => setReportType(value)}
          />
          {(isCalculationCard || isReportAvailable) && (
            <GeneratePDFButton
              text={text}
              loading={active && (loading || clicked)}
              handleClick={btnClickHandler}
              disabled={!supportCalculationId}
            />
          )}
        </div>

        {!supportCalculationId && (
          <div className='recalculation-requirement-alert font-italic'>
            To be able to create a report, you need to save calculation or enter the correct client
            name, and then calculate
          </div>
        )}
        {showDescription && (
          <div className={classnames('recalculation-requirement-alert mt-2 font-italic')}>
            Please run the calculation again to get the latest report
          </div>
        )}
        <div className='report-info'>
          <h5 className='report-title'>{reportByReportType.title}</h5>
          <p className='report-description'>{reportByReportType.description}</p>
          {active !== true && (
            <React.Fragment>
              <p>Upgrade to generate a custom report.</p>
              <p>
                <a href={reportByReportType.sample} target='sample_report'>
                  View Sample Report
                </a>
              </p>
            </React.Fragment>
          )}
        </div>

        {children}
      </div>
      <img
        src={reportByReportType.thumbnail}
        alt={reportByReportType.title}
        className='report-type-img d-inline d-sm-none'
        width='200'
        height='238'
      />
    </div>
  );
};

export default GeneratePDFButtonContainer;
