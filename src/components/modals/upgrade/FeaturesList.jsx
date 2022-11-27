import React, { useMemo } from 'react';

import { useLocation } from 'react-router';

import useCurrentUser from 'hooks/useCurrentUser';

const FeaturesList = () => {
  const { isPro } = useCurrentUser();
  const { pathname } = useLocation();

  const showNegotiate = useMemo(() => pathname.includes('spousal'), [pathname]);

  return (
    <div className='upgrade-plan-container'>
      <span className='upgrade-plan-span'>
        * Satisfaction Guaranteed. If you're not completely happy with your upgrade, let us know and
        we'll issue a{' '}
        <a className='upgrade-plan-link' href='https://www.divorcepath.com/guarantee'>
          refund
        </a>
        .
      </span>
      <ul className='upgrade-plan-list'>
        {showNegotiate && <li className='upgrade-plan-list-item'>Negotiate support amount</li>}
        <li className='upgrade-plan-list-item'>All income types</li>
        <li className='upgrade-plan-list-item'>Special child-related expenses</li>
        <li className='upgrade-plan-list-item'>Guideline income & exceptions</li>
        <li className='upgrade-plan-list-item'>Download PDF reports</li>
        {isPro && <li className='upgrade-plan-list-item'>Retroactive calculations</li>}
      </ul>
    </div>
  );
};

export default FeaturesList;
