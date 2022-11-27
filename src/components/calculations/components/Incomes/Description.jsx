import React from 'react';

import Icon from 'components/common/Icon';

const Description = ({ isSubscriptionActive, isPremium, description }) => {
  if (!isSubscriptionActive && isPremium) {
    return (
      <div className='form-text text-muted mb-2'>
        <Icon name='info-circle' className='mr-2' height='20' width='20' />
        {description}
      </div>
    );
  }

  return null;
};

export default Description;
