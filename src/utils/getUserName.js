import getProfileName from 'utils/getProfileName';

const getUserName = (user, email = true) => {
  const clientName = getProfileName(
    user?.client?.profile || user?.professional?.profile || user?.profile,
  );
  if (clientName.length > 0) {
    return clientName;
  }

  return email ? user?.email : null;
};

export default getUserName;
