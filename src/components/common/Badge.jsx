import React from 'react';

import classnames from 'classnames';

const Badge = ({ children, circle, color, className }) => (
  <span
    className={classnames(
      'badge',
      color ? `$badge-${color}` : 'badge-secondary',
      {
        'badge-circle': circle,
      },
      className,
    )}
  >
    {children}
  </span>
);

export default Badge;
