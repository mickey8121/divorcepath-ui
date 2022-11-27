import React, { useCallback } from 'react';

import { Col, Row } from 'reactstrap';

import Button from 'components/common/Button';

const PlanCard = ({
  className = '',
  pricePrepend,
  isBest,
  title,
  price,
  subPrice,
  features,
  btnText,
  isActive,
  loading,
  handleClick,
}) => {
  const renderFeatures = useCallback(
    () =>
      features.map((feature, item) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={item} className={`feature ${feature.value ? '' : 'disabled'}`}>
          {feature.label}
        </div>
      )),
    [features],
  );

  return (
    <Col className={`billing-plan-card ${className}`}>
      {isBest && (
        <Row>
          <div className='best-value'>Best value</div>
        </Row>
      )}
      <div className='title'>{title}</div>
      <div className='price'>
        <span className='price-prepend'>{pricePrepend}</span> {price}
      </div>
      <div className='sub-price'>{subPrice || '30-day access'}</div>

      <div className='features'>{renderFeatures()}</div>
      {isActive ? (
        <div className='active-subscription'>
          Current Plan <img alt='icon' src='./img/icons/check.svg' />
        </div>
      ) : (
        btnText && (
          <Button
            block
            outline={!isActive}
            size='lg'
            disabled={isActive}
            onClick={handleClick}
            loading={loading}
          >
            {btnText}
          </Button>
        )
      )}
    </Col>
  );
};

export default PlanCard;
