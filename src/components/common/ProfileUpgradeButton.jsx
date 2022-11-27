import React, { useMemo } from 'react';

import { Link } from 'react-router-dom';
import classNames from 'classnames';

import useCurrentUser from 'hooks/useCurrentUser';

import getQuantityTimeLeft from 'utils/getQuantityTimeLeft';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ProfileUpgradeButton = () => {
  const { me, isPlanFullyUpgraded } = useCurrentUser();

  const quantityDaysLeft = useMemo(
    () =>
      isPlanFullyUpgraded
        ? getQuantityTimeLeft(me?.subscription)
        : 'Free plan. Basic Calculations.',
    [isPlanFullyUpgraded, me],
  );

  const userPlanName = useMemo(() => me?.subscription?.plan?.name.split(' (')[0], [me]);

  const linkClassName = useMemo(
    () =>
      classNames('btn', 'btn-sm', 'btn-white', 'btn-icon', 'shadow', 'text-nowrap', {
        'btn-color--success': isPlanFullyUpgraded,
        'btn-color--warning': !isPlanFullyUpgraded,
      }),
    [isPlanFullyUpgraded],
  );

  const iconSpanClassName = useMemo(
    () =>
      classNames({
        'btn-upgrade--icon': isPlanFullyUpgraded,
        'btn-inner--icon': !isPlanFullyUpgraded,
      }),
    [isPlanFullyUpgraded],
  );

  const descriptionSpanClassName = useMemo(
    () =>
      classNames({
        'btn-upgrade--text': isPlanFullyUpgraded,
        'btn-inner--text': !isPlanFullyUpgraded,
      }),
    [isPlanFullyUpgraded],
  );

  const btnTitle = useMemo(() => {
    // const plans = getPlanList(isPro).map(plan => plan?.item_id);
    if (isPlanFullyUpgraded) {
      if (me?.subscription?.status === 'TRIALING') {
        return `${me.subscription.plan?.trialDays || '7'}-day access`;
      }

      if (me?.subscription?.cancelAtPeriodEnd) return '30-day access';

      return 'Subscribed';
    }

    return 'Upgrade';
  }, [isPlanFullyUpgraded, me]);

  const btnDescription = useMemo(() => {
    if (userPlanName) {
      if (quantityDaysLeft) {
        return `${userPlanName}${
          me?.subscription?.status === 'TRIALING' ? ' Trial' : ''
        }, ${quantityDaysLeft}`;
      }

      return userPlanName;
    }

    return 'Free plan. Basic Calculations.';
  }, [userPlanName, quantityDaysLeft, me]);

  return (
    <div className='profile-upgrade-btn'>
      <Link to='/plans' className={linkClassName}>
        <span className={iconSpanClassName}>
          <FontAwesomeIcon icon={isPlanFullyUpgraded ? 'user-check' : 'fire'} className='mr-2' />
        </span>
        <span className={descriptionSpanClassName}>{btnTitle}</span>
      </Link>
      <span className='small text-nowrap plan-name'>{btnDescription}</span>
    </div>
  );
};

export default ProfileUpgradeButton;
