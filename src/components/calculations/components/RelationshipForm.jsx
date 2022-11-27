import React, { useContext, useEffect, useState, useCallback, Fragment, useMemo } from 'react';

import { useFormikContext } from 'formik';
import dayjs from 'dayjs';
import numeral from 'numeral';
import { get, isObject } from 'lodash';
import { Row, Col, Collapse } from 'reactstrap';

import DayPickerInput from 'components/common/inputs/DayPickerInput';
import Icon from 'components/common/Icon';

import useCalculationContext from 'hooks/useCalculationContext';

import CalculationContext from 'context/CalculationContext/CalculationContext';

const RelationshipForm = () => {
  const { touched, errors, submitCount, values } = useFormikContext();

  const { type } = useCalculationContext();
  const { isProfessional } = useContext(CalculationContext);

  // If we are on create calculation step it should be open by default
  const [isOpen, setIsOpen] = useState(type === 'create');

  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  const hasValidationError = isObject(get(errors, 'relationship'));
  const hasFormTouched = isObject(get(touched, 'relationship'));

  useEffect(
    () => {
      if (isOpen === false && hasValidationError === true && hasFormTouched === true) {
        setIsOpen(true);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasValidationError, submitCount],
  );

  const relationship = get(values, 'relationship', {});

  const cohabitationDate = relationship.cohabitationDate
    ? dayjs(relationship.cohabitationDate).format('YYYY-DD-MM')
    : '-';
  const separationDate = relationship.separationDate
    ? dayjs(relationship.separationDate).format('YYYY-DD-MM')
    : '-';

  const relationshipDuration = useMemo(() => {
    const relationshipDateDiff =
      dayjs(relationship.separationDate).diff(relationship.cohabitationDate, 'days') / 365.0;

    if (Math.round(relationshipDateDiff) === 0) return 0;

    return numeral(relationshipDateDiff).format('0.0') || 0;
  }, [relationship]);

  return (
    <Fragment>
      <Row
        noGutters
        className='border-top py-4 px-2 px-md-0 p-lg-4 cursor-pointer'
        onClick={toggle}
      >
        <Col sm={6} lg={5} className='col-10'>
          <div className='d-flex align-items-center'>
            <span className='avatar'>
              <img
                alt='placeholder'
                src='./img/icons/dusk/png/relationship.png'
                className='img-saturate'
              />
            </span>
            <div className='avatar-content'>
              <h5 className='mb-0'>Relationship</h5>
              <small className='d-block text-muted'>{`${cohabitationDate} to ${separationDate}`}</small>
            </div>
          </div>
        </Col>

        <Col>
          <Row noGutters className='select-row justify-content-end'>
            <div className='d-none d-sm-block'>
              <div className='w-100 pl-3 pr-3 d-sm-none d-md-block justify-content-center'>
                <h5 className='mb-0 mt-2 p-0 pb-2'>{`${relationshipDuration} years`}</h5>
              </div>
            </div>

            <div className='angle-btn'>
              <span className='btn-inner--icon'>
                <Icon name={`arrow-${isOpen ? 'up' : 'down'}`} />
              </span>
            </div>
          </Row>
        </Col>
      </Row>

      <Collapse className='px-1 offset-lg-5 col-lg-7 col-md-12' isOpen={isOpen}>
        <DayPickerInput
          maxDate={dayjs(relationship.separationDate || new Date()).toDate()}
          label='Date of Cohabitation'
          hint={`Enter the date ${
            isProfessional ? ' the parties ' : ' you '
          } began cohabiting (may be the same or different from marriage date).`}
          name='relationship.cohabitationDate'
          touchable
        />

        <DayPickerInput
          maxDate={new Date()}
          minDate={dayjs(relationship.cohabitationDate || new Date()).toDate()}
          label='Date of Separation'
          hint={`Enter the date ${isProfessional ? ' the parties ' : ' you '} separated.`}
          name='relationship.separationDate'
          touchable
        />
      </Collapse>
    </Fragment>
  );
};

export default RelationshipForm;
