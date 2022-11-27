import React, { useState, useEffect } from 'react';
import Loading from 'components/common/Loading';

const Delayed = ({ children, waitBeforeShow = 1500 }) => {
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsShown(true);
    }, waitBeforeShow);
  }, [waitBeforeShow]);

  return isShown ? children : <Loading />;
};

export default Delayed;
