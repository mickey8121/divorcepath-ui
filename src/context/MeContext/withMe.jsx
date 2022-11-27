import React from 'react';

import MeContext from './MeContext';

const withMe = Component => props =>
  <MeContext.Consumer>{context => <Component {...context} {...props} />}</MeContext.Consumer>;

export default withMe;
