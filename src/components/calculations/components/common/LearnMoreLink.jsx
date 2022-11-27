import React from 'react';

import Icon from 'components/common/Icon';

const LearnMoreLink = ({ description, to }) => (
  <span className='pt-2'>
    <Icon name='info-circle' className='mr-2' height='20' width='20' />
    {description}
    {to && (
      <small>
        <a target={`amount_${to}`} href={to}>
          <Icon
            name='share'
            className='ml-2 mr-1'
            height='20'
            width='20'
            style={{ marginTop: '-2px' }}
          />
          Learn&nbsp;More
        </a>
      </small>
    )}
  </span>
);

export default LearnMoreLink;
