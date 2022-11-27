import { useQuery } from '@apollo/client';

import ORGANIZATION_QUERY from 'graphql/queries/organization/organization';

const useOrganizationQuery = (id = undefined) => {
  const query = useQuery(ORGANIZATION_QUERY, {
    variables: { where: { userId: id } },
    skip: !id,
  });

  return query;
};

export default useOrganizationQuery;
