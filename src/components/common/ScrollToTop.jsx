import React, { Fragment, useEffect, useMemo } from 'react';

import { useLocation } from 'react-router-dom';

import usePrevValue from 'hooks/usePrevValue';
import useWindowSize from 'hooks/useWindowSize';

const isClientProfileFromPro = path => /clients\/.+\/edit/.test(path);

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  const prevPathname = usePrevValue(pathname);

  const { width } = useWindowSize();

  const mobileView = useMemo(() => width <= 768, [width]);

  useEffect(() => {
    const isProfile = pathname.includes('/profile/') || isClientProfileFromPro(pathname);
    const isPrevProfile = prevPathname.includes('/profile') || isClientProfileFromPro(prevPathname);

    if (hash === '' && (!isProfile || !isPrevProfile)) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash, prevPathname, mobileView]);

  return <Fragment />;
};

export default ScrollToTop;
