import { useQuery } from '@apollo/client';

import CLIENTS_COUNT from 'graphql/queries/client/clientsCount';

const useClientsCount = whereManyArg => {
  const whereMany = whereManyArg ?? [{ NOT: { type: { equals: 'NOT_RETAINED' } } }];

  const query = useQuery(CLIENTS_COUNT, {
    variables: {
      whereMany,
    },
  });

  return query;
};

export default useClientsCount;
