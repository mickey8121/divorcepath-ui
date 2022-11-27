import React, { useMemo } from 'react';

import classNames from 'classnames';

import getCompleteProfilePercent from 'utils/getCompleteProfilePercent';

const TabNavigation = ({ client, tab, setTab }) => {
  const { profileProgress, supportCalculations, interviews } = client || {};

  const progressCount = useMemo(
    () => getCompleteProfilePercent(profileProgress),
    [profileProgress],
  );

  const tabs = useMemo(() => {
    return [
      {
        id: 1,
        label: <span>Intake</span>,
        onClick: () => setTab(1),
      },
      {
        id: 2,
        label: (
          <span>
            Profile <span className='count-badge'>{progressCount}%</span>
          </span>
        ),
        onClick: () => setTab(2),
      },
      {
        id: 3,
        label: (
          <span>
            <span className='d-none d-sm-inline'>Support</span>
            <span>Calculations</span>
            <span className='count-badge'>{supportCalculations?.length}</span>
          </span>
        ),
        onClick: () => setTab(3),
      },
      {
        id: 4,
        label: (
          <span>
            Interviews <span className='count-badge'>{interviews?.length}</span>
          </span>
        ),
        onClick: () => setTab(4),
      },
    ];
  }, [interviews?.length, supportCalculations?.length, progressCount, setTab]);

  return (
    <div className='tab-navigation-container'>
      <div className='tab-navigation'>
        {tabs.map(({ id, disabled, onClick, label }) => (
          <div
            key={id}
            onClick={onClick}
            className={classNames('tab', { disabled, active: id === tab })}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;
