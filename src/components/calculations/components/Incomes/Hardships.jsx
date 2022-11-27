import React, { useState, useCallback, useMemo } from 'react';

import numeral from 'numeral';
import { FieldArray, useFormikContext } from 'formik';
import { Collapse, Row, Col } from 'reactstrap';
import { v4 as uuidv4 } from 'uuid';

import Button from 'components/common/Button';
import { UPGRADE_PLAN_MODAL_NAME } from 'components/modals/upgrade/UpgradePlanModal';
import Icon from 'components/common/Icon';

import Income from 'components/calculations/components/Incomes/Income';
import { defaultHardship } from 'components/calculations/utils/defaultValues';

import useCalculationContext from 'hooks/useCalculationContext';
import useModal from 'hooks/useModal';

import customGet from 'utils/get';
import allTaxTables from 'utils/taxTables';

const reducer = (acc, item) => acc + (item?.userAmount || 0);
const handleAddAmount = arrayHelpers => arrayHelpers.push({ ...defaultHardship, id: uuidv4() });

const Hardships = ({ partyType, partyFirstName }) => {
  const { values } = useFormikContext();
  const { isSubscriptionActive } = useCalculationContext();
  const { open } = useModal(UPGRADE_PLAN_MODAL_NAME);

  const hardshipOptions = useMemo(() => allTaxTables[values.taxYear].hardship, [values.taxYear]);

  const pathToAllHardship = useMemo(() => `${partyType}.hardship.all`, [partyType]);

  const hardships = useMemo(
    () => customGet(values, pathToAllHardship, []),
    [values, pathToAllHardship],
  );

  const isHardshipFixedOpen = useMemo(() => hardships.length > 0, [hardships]);

  const [isHardshipOpen, setIsHardshipOpen] = useState(isHardshipFixedOpen);

  const totalHardships = useMemo(
    () => customGet(values, pathToAllHardship, []).reduce(reducer, 0),
    [pathToAllHardship, values],
  );

  const displayValue = useMemo(
    () => `${partyFirstName} Undue Hardship Claim: ${numeral(totalHardships).format('$0,0')}`,
    [partyFirstName, totalHardships],
  );

  const toggleIsHardship = useCallback(() => setIsHardshipOpen(prev => !prev), []);

  return (
    <FieldArray name={pathToAllHardship}>
      {arrayHelpers => (
        <div className='border-bottom'>
          <Row
            className='cursor-pointer'
            noGutters
            onClick={() => (isHardshipFixedOpen ? null : toggleIsHardship())}
          >
            <Col xs={11} className='pt-2'>
              <strong className='text-black'>Claim Undue Hardship</strong>
            </Col>
            <Col xs={1} className='btn-icon-only p-0 m-0 pr-3'>
              <div className='d-flex flex-row-reverse'>
                <span className='btn-inner--icon'>
                  <Icon name={`arrow-${isHardshipOpen ? 'up' : 'down'}`} className='mr-2' />
                </span>
              </div>
            </Col>
          </Row>

          <Collapse isOpen={isHardshipFixedOpen || isHardshipOpen}>
            <div className='pl-3 pr-3 pb-3'>
              <div className='pb-2'>
                Enter undue hardship claims below. For more information on when and how to claim
                undue hardship, visit the
                <a target='new' href='https://www.divorcepath.com/help'>
                  {' '}
                  help centre
                </a>
                .
              </div>
              {hardships.map((hardship, index) => (
                <Income
                  key={`hardship.${hardship?.id || index}`}
                  index={index}
                  amount={hardship}
                  partyType={partyType}
                  pathToAll={pathToAllHardship}
                  fieldType='hardship'
                  options={hardshipOptions}
                  remove={() => arrayHelpers.remove(index)}
                  upgradeDescription='Undue Hardship claims are a premium feature. Upgrade to calculate support including undue hardship claims.'
                />
              ))}
              <div>{displayValue}</div>

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
                New Hardship Claim
              </Button>
            </div>
          </Collapse>
        </div>
      )}
    </FieldArray>
  );
};

export default Hardships;
