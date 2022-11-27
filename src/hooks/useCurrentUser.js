import { useContext } from 'react';

import MeContext from 'context/MeContext/MeContext';

const useCurrentUser = () => {
  const user = useContext(MeContext);
  return user;
};

export default useCurrentUser;
