import { useEffect, useMemo, useState } from 'react';

import { useDebouncedCallback } from 'use-debounce/lib';

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  const handleResize = useDebouncedCallback(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, 200);

  useEffect(() => {
    handleResize();
  }, [handleResize]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const isMobileView = useMemo(() => {
    return windowSize.width <= 768;
  }, [windowSize]);

  return { windowSize, isMobileView };
};

export default useWindowSize;
