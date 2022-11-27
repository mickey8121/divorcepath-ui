import React from 'react';

const initialMeContextValues = {
  me: {},
  loading: true,

  isFreeSub: true,
  isActiveSub: false,
  isChildSpousalSub: false,
};

const MeContext = React.createContext(initialMeContextValues);

export default MeContext;
