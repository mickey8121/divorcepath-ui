import React from 'react';

import classnames from 'classnames';
import { Link } from 'react-scroll';

const ScrollLink = ({ children, onClick, to, className, ...props }) => (
  <Link
    smooth
    duration={400}
    to={to}
    className={classnames('cursor-pointer scroll-link', className)}
    onClick={onClick}
    hashSpy
    name={to}
    {...props}
  >
    {children}
  </Link>
);

export default ScrollLink;
