import React from 'react';

const PlanPage = ({ children, noInvite }) => (
  <div className='plan-page' style={noInvite ? { minHeight: 'calc(100vh - 650px)' } : {}}>
    <div className='form-card-container'>
      <div className='card shadow auth-form'>
        <div className='card-body px-md-5 py-5'>{children}</div>
      </div>
    </div>
  </div>
);

export default PlanPage;
