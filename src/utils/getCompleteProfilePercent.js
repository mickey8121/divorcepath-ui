const getCompleteProfilePercent = profileProgress => {
  if (profileProgress) {
    const completed = Object.values(profileProgress).filter(progress => progress === 'COMPLETE');
    const incompleted = Object.values(profileProgress).filter(
      progress => progress === 'INCOMPLETE',
    );

    return Math.round((completed.length / 6 + incompleted.length / 12) * 100);
  }

  return 0;
};

export default getCompleteProfilePercent;
