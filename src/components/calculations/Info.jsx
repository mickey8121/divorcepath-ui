import React, { useContext } from 'react';

import CalculationContext from 'context/CalculationContext/CalculationContext';

const Info = () => {
  const { isProfessional, isSubscriptionActive, calculatorType, planId, type, subscriptionType } =
    useContext(CalculationContext);

  return (
    <div
      className='calculation-floating-info'
      style={{
        position: 'absolute',
        top: 0,
        backgroundColor: '#f0f8ff80',
        zIndex: 10,
        padding: '10px',
        fontSize: '12px',
        lineHeight: 1.5,
      }}
    >
      <div>
        type:
        {`${type}`}
      </div>
      <div>
        isProfessional:
        {`${isProfessional}`}
      </div>
      <div>
        isSubscriptionActive:
        {`${isSubscriptionActive}`}
      </div>
      <div>
        calculatorType:
        {calculatorType}
      </div>
      <div>
        planId:
        {planId}
      </div>
      <div>
        subscriptionType:
        {subscriptionType}
      </div>
    </div>
  );
};

export default Info;
