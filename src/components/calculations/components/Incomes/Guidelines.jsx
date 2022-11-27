import React, { useState, useCallback, useMemo } from 'react';

import numeral from 'numeral';
import { FieldArray, useFormikContext } from 'formik';
import { Collapse, Row, Col } from 'reactstrap';
import { v4 as uuidv4 } from 'uuid';

import Button from 'components/common/Button';
import { UPGRADE_PLAN_MODAL_NAME } from 'components/modals/upgrade/UpgradePlanModal';
import Icon from 'components/common/Icon';

import Income from 'components/calculations/components/Incomes/Income';
import { defaultAdjustment } from 'components/calculations/utils/defaultValues';

import useCalculationContext from 'hooks/useCalculationContext';
import useModal from 'hooks/useModal';

import customGet from 'utils/get';
import allTaxTables from 'utils/taxTables';

const reducer = (acc, item) => acc + (item?.userAmount || 0);

const handleAddAmount = arrayHelpers => arrayHelpers.push({ ...defaultAdjustment, id: uuidv4() });

const Guidelines = ({ partyType, partyFirstName }) => {
  const { values } = useFormikContext();
  const { isSubscriptionActive } = useCalculationContext();
  const { open } = useModal(UPGRADE_PLAN_MODAL_NAME);

  const adjustmentsOptions = useMemo(
    () => allTaxTables[values.taxYear].adjustments,
    [values.taxYear],
  );

  const pathToAllAdjustments = useMemo(() => `${partyType}.adjustments.all`, [partyType]);

  const adjustments = useMemo(
    () => customGet(values, pathToAllAdjustments, []),
    [pathToAllAdjustments, values],
  );

  const isAdjustmentFixedOpen = useMemo(() => adjustments.length > 0, [adjustments]);

  const [isAdjustmentsOpen, setIsAdjustmentsOpen] = useState(isAdjustmentFixedOpen);

  const toggleIsAdjustments = useCallback(() => setIsAdjustmentsOpen(prev => !prev), []);

  const totalAdjustments = useMemo(
    () => customGet(values, pathToAllAdjustments, []).reduce(reducer, 0),
    [pathToAllAdjustments, values],
  );

  const csAdjustments = useMemo(
    () =>
      adjustments?.filter(i =>
        adjustmentsOptions.find(opt => opt.key === i?.key && opt.child_support !== false),
      ),
    [adjustments, adjustmentsOptions],
  );

  const ssAdjustments = useMemo(
    () =>
      adjustments?.filter(i =>
        adjustmentsOptions.find(opt => opt.key === i?.key && opt.spousal_support !== false),
      ),
    [adjustments, adjustmentsOptions],
  );

  const ssGuidelineIncome = useMemo(
    () =>
      values?.[partyType]?.income?.all?.reduce(
        (acc, item) => acc + parseInt(item?.userAmount, 10) || 0,
        0,
      ) + ssAdjustments.reduce((acc, item) => acc + parseInt(item?.userAmount, 10) || 0, 0),
    [values, partyType, ssAdjustments],
  );

  const csGuidelineIncome = useMemo(
    () =>
      values?.[partyType]?.income?.all?.reduce(
        (acc, item) => acc + parseInt(item?.userAmount, 10) || 0,
        0,
      ) + csAdjustments.reduce((acc, item) => acc + parseInt(item?.userAmount, 10) || 0, 0),
    [values, partyType, csAdjustments],
  );

  const separateIncomes = useMemo(
    () => ssGuidelineIncome !== csGuidelineIncome,
    [csGuidelineIncome, ssGuidelineIncome],
  );

  return (
    <FieldArray name={pathToAllAdjustments}>
      {arrayHelpers => (
        <div className='border-bottom'>
          <Row
            noGutters
            className='border-top mx-0 py-0 mt-4 mb-0 cursor-pointer'
            onClick={() => (isAdjustmentFixedOpen ? null : toggleIsAdjustments())}
          >
            <Col xs={11} className='pt-2'>
              <strong className='text-black'>Adjust Guideline Income</strong>
            </Col>
            <Col xs={1} className='btn-icon-only p-0 m-0 pr-3'>
              <div className='d-flex flex-row-reverse'>
                <span className='btn-inner--icon'>
                  <Icon name={`arrow-${isAdjustmentsOpen ? 'up' : 'down'}`} className='mr-2' />
                </span>
              </div>
            </Col>
          </Row>

          <Collapse isOpen={isAdjustmentFixedOpen || isAdjustmentsOpen}>
            <div className='pl-3 pr-3 pb-3'>
              <div className='pb-2 mb-2 border-bottom'>
                <Icon name='info-circle' className='mr-2' height='20' width='20' />
                Adjustments to Line 15000 Total Income may be required to calculate support.
                Schedule III of the Child Support Guidelines lists most of the adjustments. These
                include deducting employment-related expenses, business losses, capital gains (the
                calculator handles this automatically) and other adjustments listed in the dropdown
                below. Visit the
                <a target='new' href='https://www.divorcepath.com/help'>
                  {` help centre`}
                </a>
                {` for more information.`}
              </div>
              {adjustments.length > 0 ? (
                adjustments.map((adjustment, index) => (
                  <Income
                    key={`adjustments.${adjustment?.id || index}`}
                    index={index}
                    amount={adjustment}
                    partyType={partyType}
                    pathToAll={pathToAllAdjustments}
                    options={adjustmentsOptions}
                    fieldType='adjustments'
                    remove={() => {
                      arrayHelpers.remove(index);
                    }}
                    upgradeDescription='Adjustments to Guideline Income are a premium feature. Upgrade to calculate support including guideline income adjustments.'
                  />
                ))
              ) : (
                <div className='pt-3 pb-3 mb-3 border-bottom'>
                  <span className='font-italic'>No Adjustments Entered</span>
                </div>
              )}

              <div className='mb-2'>
                {partyFirstName}
                &nbsp;Total Adjustments:&nbsp;
                {numeral(totalAdjustments).format('$0,0')}
              </div>

              <div>
                {separateIncomes ? (
                  <React.Fragment>
                    <div className='mb-2'>
                      Child Support Guideline Income:&nbsp;
                      {numeral(csGuidelineIncome).format('$0,0')}
                    </div>
                    <div className='mb-2'>
                      &nbsp;Spousal Support Guideline Income:&nbsp;
                      {numeral(ssGuidelineIncome).format('$0,0')}
                    </div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <div className='mb-2'>
                      Guideline Income:&nbsp;
                      {numeral(ssGuidelineIncome).format('$0,0')}
                    </div>
                  </React.Fragment>
                )}
              </div>

              <Button
                size='md'
                color='link'
                className='mt-3'
                onClick={() => {
                  handleAddAmount(arrayHelpers);
                  if (!isSubscriptionActive) open();
                }}
                leftIcon='plus'
              >
                New Adjustment
              </Button>
            </div>
          </Collapse>
        </div>
      )}
    </FieldArray>
  );
};

export default Guidelines;
