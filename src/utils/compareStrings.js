const compareStrings = (...args) =>
  args[0]
    ?.replaceAll(/\s/g, '')
    .toLowerCase()
    .includes(args[1]?.replaceAll(/\s/g, '').toLowerCase());

export default compareStrings;
