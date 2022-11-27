import { isEqual, uniqWith } from 'lodash';

import calcPermutations from 'utils/math/permutations';

const generateClientsQuery = (debouncedSearchValue, nameKeys) => {
  const searchArray = debouncedSearchValue.split(/\s+/, nameKeys.length);

  const searchValues =
    searchArray.length < nameKeys.length
      ? searchArray.concat(new Array(nameKeys.length - searchArray.length).fill(null))
      : searchArray;

  const searchArrayPermutations = uniqWith(calcPermutations(searchValues), isEqual);

  return {
    profile: {
      OR: searchArrayPermutations.map(values => {
        return {
          AND: values.reduce(
            (arr, value, index) =>
              value
                ? arr.concat({ [nameKeys[index]]: { startsWith: value, mode: 'insensitive' } })
                : arr,
            [],
          ),
        };
      }),
    },
  };
};

export default generateClientsQuery;
