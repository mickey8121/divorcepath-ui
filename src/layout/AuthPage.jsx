import React from 'react';

import classnames from 'classnames';

const AuthPage = ({ children, noInvite, isCard = true, className }) => {
  if (!isCard) {
    return (
      <div className='auth-page' style={noInvite ? { minHeight: 'calc(100vh - 650px)' } : {}}>
        <div className='form-card-container'>{children}</div>
      </div>
    );
  }

  return (
    <div
      className={classnames('auth-page', className)}
      style={noInvite ? { minHeight: 'calc(100vh - 650px)' } : {}}
    >
      <div className='form-card-container'>
        <div className='card shadow auth-form'>
          <div className='card-body px-md-5 py-5'>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
