const getName = ({ lastName, firstName }) => {
  if (lastName && firstName) return `${firstName} ${lastName}`;
  return firstName || lastName || '';
};

export default getName;
