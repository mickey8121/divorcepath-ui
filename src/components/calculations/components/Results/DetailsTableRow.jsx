import React from 'react';

import numeral from 'numeral';
import { Collapse, Row, Col } from 'reactstrap';

import Icon from 'components/common/Icon';

const DetailsTableRow = ({
  label,
  clientValue,
  exValue,
  exPercent,
  clientPercent,
  description,
  reference,
  setRow,
  index,
  activeRow,
  yearsValue,
  stringValue,
  exString,
}) => {
  const isRowOpen = activeRow === index;
  const isExColShow = !!(exPercent || exPercent === 0 || exValue || exValue === 0 || exString);

  return (
    <div className='details-table-row'>
      <Row
        noGutters
        className={`${isRowOpen ? 'expanded' : ''}`}
        onClick={() => setRow(isRowOpen ? '' : index)}
      >
        <Col xs={5}>{label}</Col>

        <Col xs={isExColShow ? 3 : 6}>
          {clientPercent && `${(clientPercent * 100).toFixed(1)}%`}
          {(clientValue || clientValue === 0) && numeral(clientValue).format('($0,0')}
          {yearsValue && `${yearsValue} years`}
          {stringValue && stringValue}
        </Col>

        {isExColShow && (
          <Col xs={3}>
            {exPercent && `${(exPercent * 100).toFixed(1)}%`}
            {(exValue || exValue === 0) && numeral(exValue).format('($0,0')}
            {exString && exString}
          </Col>
        )}

        <Col xs={1}>
          <div className='btn-icon-only pr-3'>
            <span className='btn-inner--icon'>
              <Icon name={`arrow-${isRowOpen ? 'up' : 'down'}`} />
            </span>
          </div>
        </Col>
      </Row>

      <Collapse isOpen={isRowOpen}>
        <div className='p-3'>
          <Icon name='info-circle' className='mr-2' height='20' width='20' /> {description}
          {reference}
        </div>
      </Collapse>
    </div>
  );
};

export default DetailsTableRow;
