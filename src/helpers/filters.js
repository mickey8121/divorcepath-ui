export const filters = {
  YOUR_CLIENTS: 'YOUR_CLIENTS',
  POTENTIAL_CLIENTS: 'POTENTIAL_CLIENTS',
  ALL_FIRM_CLIENTS: 'ALL_FIRM_CLIENTS',
};

export const applyFilterToQuery = (filter, { id }) => {
  return baseQuery => {
    switch (filter) {
      case filters.POTENTIAL_CLIENTS:
        return {
          AND: [baseQuery, { type: { equals: 'POTENTIAL' } }],
        };
      case filters.YOUR_CLIENTS:
        return {
          AND: [
            baseQuery,
            {
              professionals: {
                some: {
                  id: { equals: id },
                },
              },
            },
          ],
        };
      default:
        return baseQuery;
    }
  };
};

export const getFilterCountersWhere = professionalId => {
  return Object.values(filters).map(filter => {
    return applyFilterToQuery(filter, { id: professionalId })({
      NOT: { type: { equals: 'NOT_RETAINED' } },
    });
  });
};
