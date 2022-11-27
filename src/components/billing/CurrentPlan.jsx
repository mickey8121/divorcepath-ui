import React, { useCallback, useMemo, useState } from 'react';

import { Collapse } from 'reactstrap';
import dayjs from 'dayjs';

import Icon from 'components/common/Icon';

import { getPlanList } from 'components/calculations/utils/defaultValues';

import useCurrentUser from 'hooks/useCurrentUser';

import getQuantityTimeLeft from 'utils/getQuantityTimeLeft';

const CurrentPlan = () => {
  const { me, isActiveSub, isPlanFullyUpgraded, isPro } = useCurrentUser();

  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  const subscription = useMemo(() => me?.subscription, [me?.subscription]);

  const isActive = useMemo(
    () => isActiveSub && isPlanFullyUpgraded,
    [isPlanFullyUpgraded, isActiveSub],
  );

  const currentPlan = useMemo(() => {
    const plans = getPlanList(isPro);

    if (!subscription) return plans.find(plan => plan.item_id === 'FREE');

    return (
      plans.find(plan => plan.item_id === subscription?.plan?.id) ||
      plans.find(plan => plan.item_id === 'FREE')
    );
  }, [isPro, subscription]);

  const preparedPlan = useMemo(() => {
    const { currentPeriodEnd, plan, status } = subscription || {};

    const userPlanName = plan?.name.split(' (')[0] ?? '';
    const isTrial = status === 'TRIALING' ? ' Trial' : '';

    const paymentStatus = isTrial || (subscription ? 'Paid' : 'N/A');

    const daysLeft = parseInt(getQuantityTimeLeft(subscription) || 0, 10) || 0;

    return [
      {
        label: 'Current Plan',
        description: `${userPlanName}${isTrial || (isPro ? ' (Professional)' : '')}`,
      },
      {
        label: 'Price',
        description: `$${currentPlan?.price}`,
      },
      {
        label: 'Expiration Date',
        description: daysLeft ? dayjs(currentPeriodEnd).format('DD.MM.YYYY') : 'Expired',
      },
      {
        label: 'Days Left',
        description: daysLeft,
      },
      {
        label: 'Payment Status',
        description: paymentStatus,
      },
    ];
  }, [currentPlan, subscription, isPro]);

  const freePlan = useMemo(() => {
    return [
      {
        label: 'Current Plan',
        description: 'Free Plan',
      },
      {
        label: 'Price',
        description: 'Free',
      },
      {
        label: 'Expiration Date',
        description: 'Never',
      },
      {
        label: 'Days Left',
        description: 'N/A',
      },
      {
        label: 'Payment Status',
        description: 'N/A',
      },
    ];
  }, []);

  return (
    <div className='current-plan'>
      <div className='current-plan-row' onClick={toggle}>
        <div className='plan-desc-list'>
          {(isActive ? preparedPlan : freePlan).map(({ label, description }) => (
            <div className='plan-description' key={label}>
              <span className='label'>{label}</span>
              <span className='description'>{description}</span>
            </div>
          ))}
        </div>
        <span className='row-icon btn-inner--icon'>
          <Icon name={`arrow-${isOpen ? 'up' : 'down'}`} />
        </span>
      </div>
      <Collapse isOpen={isOpen}>
        <div className='current-plan-content'>
          {subscription && (
            <p className='title'>
              {isActive
                ? 'When your account expires, it will automatically be switched to ”free”, but you will still have access to your saved calculations.'
                : 'This subscription has expired. Your account access has been downgraded to the "Free" plan. To upgrade again, select a plan below.'}
            </p>
          )}

          <p className='subtitle'>
            Satisfaction Guaranteed. If you're not completely happy with your upgrade, let us know
            and we'll issue a{' '}
            <a
              href='https://www.divorcepath.com/guarantee'
              target='_blank'
              rel='noopener noreferrer'
              className='refund-link'
            >
              refund
            </a>
          </p>
          <a
            href='https://www.divorcepath.com/privacy'
            target='_blank'
            rel='noopener noreferrer'
            className='privacy-link'
          >
            Privacy Policy
          </a>
        </div>
      </Collapse>
    </div>
  );
};

export default CurrentPlan;
