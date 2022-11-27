import React, { useEffect, useMemo, useCallback } from 'react';

import { useFormikContext } from 'formik';
import classnames from 'classnames';

import Button from 'components/common/Button';
import ScrollLink from 'components/common/ScrollLink';
import Icon from 'components/common/Icon';

import scrollToError from 'components/calculations/sidebar/scrollToError';

import useCalculationContext from 'hooks/useCalculationContext';
import useWindowSize from 'hooks/useWindowSize';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CalculateButtons = ({
  loading,
  supportCalculation,
  setIsChanged,
  isChanged,
  queryLoading,
  sidebar = true,
}) => {
  const { isSubmitting, touched, values } = useFormikContext();
  const { calculationId, isSharedCalculation } = useCalculationContext();
  const { isMobileView } = useWindowSize();

  useEffect(() => {
    if (Object.keys(touched).length !== 0) {
      setIsChanged(true);
    }
  }, [values, touched, setIsChanged]);

  const hasCalculationResult = useMemo(
    () => supportCalculation?.calculationResult?.spousalSupport,
    [supportCalculation],
  );

  const handleClick = useCallback(() => {
    const element = document.getElementById('generateReports');

    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const showDwnBtn = useMemo(
    () => hasCalculationResult && isChanged === false,
    [hasCalculationResult, isChanged],
  );

  return (
    <div
      className={classnames(
        'calculate-buttons',
        { 'ml-4 mb-4 mt-0': !sidebar },
        { sidebar },
        { 'd-flex': isMobileView },
      )}
    >
      <Button
        id='calculateButton'
        type='submit'
        onClick={() => scrollToError()}
        size='lg'
        disabled={queryLoading || (loading && isSubmitting)}
        className={classnames('preloader-btn', {
          open: !hasCalculationResult || isChanged,
        })}
        leftIcon='spinner'
        spin={isSubmitting || queryLoading}
      >
        {queryLoading ? 'Loading' : isSubmitting ? 'Calculating' : 'Calculate'}
      </Button>
      {showDwnBtn && (
        <React.Fragment>
          <Button
            id='downloadButton'
            className={classnames({
              open: !loading && hasCalculationResult,
              'pl-3 pr-3': isMobileView,
            })}
            size='lg'
            onClick={handleClick}
          >
            <FontAwesomeIcon icon='file-pdf' className='mr-2' />
            {isMobileView ? 'Download' : 'Download Report'}
          </Button>

          {calculationId && !isSharedCalculation && (
            <div className={`share-calculation-link ${isMobileView ? 'mt-0' : 'mt-3'}`}>
              <ScrollLink to='#share-calculation'>
                <div className={`d-flex align-items-center link ${isMobileView ? 'ml-2' : 'ml-3'}`}>
                  {isMobileView ? (
                    <Button
                      id='share-calculation'
                      size='lg'
                      className={`btn open ${isMobileView && 'pl-3 pr-3'}`}
                    >
                      <Icon name='share' fill='#FFFFFF' />
                    </Button>
                  ) : (
                    <Button size='md' color='link' leftIcon='share' className='share-calculation'>
                      Share Calculation
                    </Button>
                  )}
                </div>
              </ScrollLink>
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
};

export default CalculateButtons;
