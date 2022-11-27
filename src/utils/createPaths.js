import { get, findIndex } from 'lodash';

const createPaths = (i, pathToAmount, otherAmountPath, values, name) => {
  let index = i;

  if (get(values, pathToAmount)?.userInputs?.update?.length) {
    const amount = get(values, pathToAmount)?.userInputs?.update;

    index = findIndex(amount, a => a?.data?.name === name);
  }

  return {
    otherPath: otherAmountPath === '' ? '' : `${otherAmountPath}.userInputs.${index}.floatData`,
    path: `${pathToAmount}.userInputs.${index}.floatData`,
    defaultValue: `${pathToAmount}.defaultInputs.${index}.floatData`,
  };
};

export default createPaths;
