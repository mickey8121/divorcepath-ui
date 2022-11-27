import { useCallback } from 'react';

import { useApolloClient } from '@apollo/client';

const useLazyQuery = query => {
  const client = useApolloClient();

  return useCallback(
    (variables, fetchPolicy = 'cache-first') => client.query({ query, variables, fetchPolicy }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [client],
  );
};

export default useLazyQuery;
