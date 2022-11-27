import { useQuery } from '@apollo/client';
import { sortBy } from 'lodash';

import SUPPORT_CALCULATION_RESULTS from 'graphql/queries/calculations/supportCalculationResults';

const useCalculationResult = calculationId => {
  const query = useQuery(SUPPORT_CALCULATION_RESULTS, {
    variables: { where: { supportCalculation: { id: { equals: calculationId } } } },
    errorPolicy: 'all',
    skip: !calculationId,
  });

  const data = sortBy(query.data?.supportCalculationResults, 'createdAt')?.reverse()?.[0];

  return [data, query.loading];
};

export default useCalculationResult;
