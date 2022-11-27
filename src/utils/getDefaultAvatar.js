const getDefaultAvatar = gender => {
  if (gender) {
    return `./img/icons/dusk/png/user-${gender === 'MALE' ? 'male' : 'female'}.png`;
  }

  return `./img/icons/dusk/png/account.png`;
};

export default getDefaultAvatar;
