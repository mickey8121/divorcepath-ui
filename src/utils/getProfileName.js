const getProfileName = ({ firstName, middleName, lastName, email } = {}) => {
  let name = '';

  if (firstName) {
    name += firstName;
  }

  if (middleName) {
    name += ` ${middleName}`;
  }

  if (lastName) {
    name += ` ${lastName}`;
  }

  if (name.length) {
    return name;
  }

  return email || '';
};

export default getProfileName;
