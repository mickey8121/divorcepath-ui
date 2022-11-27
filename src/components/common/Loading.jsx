import React from 'react';

import classnames from 'classnames';

const Loading = ({ page, calculation }) => (
  <div className={classnames('loading', { page, calculation })}>
    <div className='dots-container'>
      {[1, 2, 3, 4, 5].map(dot => (
        <div className='dot' key={dot} />
      ))}
    </div>
  </div>
);

export default Loading;
