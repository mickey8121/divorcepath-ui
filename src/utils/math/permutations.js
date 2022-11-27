export const calcPermutations = arr => {
  if (arr.length <= 2) return arr.length === 2 ? [arr, [arr[1], arr[0]]] : arr;

  return arr.reduce(
    (acc, item, i) =>
      acc.concat(
        calcPermutations([...arr.slice(0, i), ...arr.slice(i + 1)]).map(val => [item, ...val]),
      ),
    [],
  );
};

export default calcPermutations;
