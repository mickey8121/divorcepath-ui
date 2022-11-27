const getChildAvatar = (gender, age = 0) => {
  if (gender) {
    const avatar =
      age < 3
        ? 'baby'
        : age < 18
        ? gender === 'MALE'
          ? 'boy'
          : 'girl'
        : gender === 'MALE'
        ? 'user-male'
        : 'user-female';
    return `./img/icons/dusk/png/${avatar}.png`;
  }

  return `./img/icons/dusk/png/baby.png`;
};

export default getChildAvatar;
