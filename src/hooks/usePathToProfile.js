import { useMemo } from 'react';

import useCurrentUser from 'hooks/useCurrentUser';

const usePathToProfile = () => {
  const { me } = useCurrentUser();

  const pathToProfile = useMemo(() => {
    if (me?.professional?.id) return '/profile';
    if (me?.client?.id) return '/profile/background';
  }, [me]);

  return pathToProfile || '';
};

export default usePathToProfile;
