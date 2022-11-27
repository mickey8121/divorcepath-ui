import customGet from 'utils/get';

export default (scenario, payor, postfix1, postfix2) => {
  const result = [
    Math.abs(Math.round(customGet(scenario, `payor.${postfix1}`, 0))),
    Math.abs(Math.round(customGet(scenario, `payee.${postfix2}`, 0))),
  ];

  return result;
};
