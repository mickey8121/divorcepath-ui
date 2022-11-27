const redirectToPublic = () => {
  if (window.location.pathname.includes('spousal-support')) {
    return window.location.replace(
      `${process.env.REACT_APP_CALCULATION_REDIRECT_LINK}/spousal-support-calculator`,
    );
  }

  return window.location.replace(
    `${process.env.REACT_APP_CALCULATION_REDIRECT_LINK}/child-support-calculator`,
  );
};

export default redirectToPublic;
