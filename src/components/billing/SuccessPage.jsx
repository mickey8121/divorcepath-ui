import React, { useEffect, useMemo, useCallback, useState, useRef } from 'react';

import { useHistory, Redirect } from 'react-router';
import dayjs from 'dayjs';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';

import AuthPage from 'layout/AuthPage';

import Button from 'components/common/Button';
import Loading from 'components/common/Loading';

import {
  defaultErrorPlanNote,
  defaultPlans,
  getDefaultPersonalPlanNote,
  getDefaultProPlanNote,
} from 'components/calculations/utils/defaultValues';

import useCurrentUser from 'hooks/useCurrentUser';

import get from 'utils/get';
import getQuantityTimeLeft from 'utils/getQuantityTimeLeft';

import NOTIFY_USER_RESPONSE from 'graphql/mutations/user/notifyUserResponse';

const getIsLocalNotified = () => {
  try {
    return !!JSON.parse(localStorage.getItem('isNotified'));
  } catch (err) {
    localStorage.setItem('isNotified', true);

    return true;
  }
};

const SuccessPage = () => {
  const { me, isPro, currentPeriodPlanLength, isNotifiedUser, refetchMe } = useCurrentUser();
  const [fetchCounter, setFetchCounter] = useState(0);
  const history = useHistory();
  const intervalRef = useRef();

  const [loading, setLoading] = useState(true);
  const [notifyUser] = useMutation(NOTIFY_USER_RESPONSE);

  const currentStatus = useMemo(() => get(me, 'subscription.status', null), [me]);
  const currentPeriodEnd = useMemo(() => get(me, 'subscription.currentPeriodEnd', null), [me]);
  const isActive = useMemo(() => currentStatus === 'ACTIVE', [currentStatus]);
  const isTrial = useMemo(() => currentStatus === 'TRIALING', [currentStatus]);
  const isError = useMemo(() => !isActive && !isTrial, [isActive, isTrial]);

  const planName = useMemo(() => get(me, 'subscription.plan.name', null), [me]);

  const plan = useMemo(() => {
    if (isNotifiedUser) return null;

    const planType = isPro ? 'pro' : 'client';
    const planField = isPro ? 'subscription' : currentPeriodPlanLength ?? 1;
    const planId = me?.subscription?.plan.id;

    return get(defaultPlans, `${planType}.${planField}.${planId}`, null);
  }, [currentPeriodPlanLength, isPro, me, isNotifiedUser]);

  const planPrice = useMemo(() => {
    if (isNotifiedUser || !plan) return null;

    return `${plan.pricePrepend}${plan.price}`;
  }, [isNotifiedUser, plan]);

  const planStatus = useMemo(() => {
    if (isTrial) return 'Trial';

    if (isActive) return 'Paid';

    return 'Not Paid';
  }, [isActive, isTrial]);
  const statusClassName = useMemo(() => {
    if (isActive) return 'success';

    if (isTrial) return 'trial';

    return 'error';
  }, [isActive, isTrial]);

  const planExpiration = useMemo(() => {
    if (isNotifiedUser || isError) return null;

    const currentPeriodEndFormatted = dayjs(currentPeriodEnd).format('YYYY-MM-DD');

    if (!isPro) return currentPeriodEndFormatted;

    if (currentStatus === 'TRIALING') return currentPeriodEndFormatted;

    return null;
  }, [isNotifiedUser, isError, currentPeriodEnd, isPro, currentStatus]);

  const planNote = useMemo(() => {
    const fullDate = dayjs(currentPeriodEnd).format('dddd, DD MMMM YYYY');

    if (isPro) return getDefaultProPlanNote(fullDate, isTrial);

    if (isActive) return getDefaultPersonalPlanNote(fullDate);

    return defaultErrorPlanNote;
  }, [currentPeriodEnd, isActive, isPro, isTrial]);

  const daysLeft = useMemo(() => {
    if (isPro && !isTrial && isActive) return null;

    return getQuantityTimeLeft(me?.subscription, true);
  }, [me, isTrial, isPro, isActive]);

  const isNameFilled = useMemo(
    () => (isPro ? !!me?.professional?.profile?.firstName : !!me?.client?.profile?.firstName),
    [me, isPro],
  );

  const redirectLink = useMemo(
    () => (isNameFilled ? '/plans' : '/complete-account'),
    [isNameFilled],
  );

  const handleButtonClick = useCallback(
    () => history.replace(redirectLink),
    [history, redirectLink],
  );

  const handleNotify = useCallback(async () => {
    try {
      await notifyUser();

      return localStorage.setItem('isNotified', true);
    } catch (err) {
      return err.graphQLErrors?.map(({ message }) => toast.error(message));
    }
  }, [notifyUser]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      refetchMe();
      setFetchCounter(prev => prev + 1);
    }, 500);

    return () => clearInterval(intervalRef.current);
  }, [refetchMe]);

  useEffect(() => {
    if ((me.subscription && loading) || fetchCounter > 100) {
      clearInterval(intervalRef.current);

      setLoading(false);
    }
  }, [me, loading, fetchCounter, notifyUser]);

  useEffect(() => {
    if (me.subscription) handleNotify();
  }, [handleNotify, me]);

  if (loading || fetchCounter > 99) {
    return (
      <AuthPage className='success-page'>
        {loading ? (
          <Loading />
        ) : (
          <div className='success-page-error-container'>
            <b className='success-page-error-message'>Sorry, the server's not responding...</b>
            <Button onClick={handleButtonClick} outline block size='lg'>
              OK
            </Button>
          </div>
        )}
      </AuthPage>
    );
  }

  if (isNotifiedUser === true || getIsLocalNotified()) return <Redirect to={redirectLink} />;

  // trigger conversion event for google analytics
  const dataLayer = window.dataLayer || [];
  dataLayer.push({ ecommerce: null });
  dataLayer.push({
    event: 'purchase',
    traffic_type: window.location.hostname === 'www.divorcepath.com' ? 'external' : 'internal',
    ecommerce: {
      transaction_id: me.subscription?.stripeId || null, // need unique transaction ID
      currency: 'CAD',
      value: parseFloat(plan.price) || 0,
      tax: parseFloat(me.subscription?.amountTax) || 0, // need value of tax from transaction
      total: parseFloat(me.subscription?.amountTotal) || 0,
      subtotal: me.subscription?.amountSubtotal || 0,
      checkout_result: statusClassName || null,
      items: [
        {
          item_id: me.subscription?.plan.id || null,
          item_name: planName || null,
          currency: 'CAD',
          price: parseFloat(plan.price) || null,
          trial: isTrial || false,
          pro: isPro || false,
          recurring: isPro || false, // only pro plans are recurring
          quantity: 1,
        },
      ],
    },
  });

  return (
    <AuthPage className='success-page'>
      <h6 className='success-page-heading'>Your Plan</h6>
      <ul className='success-page-list'>
        {!isError && (
          <li className='success-page-list-item'>
            <span className='success-page-label'>{planName}:</span>
            <span className='success-page-value'>{planPrice}</span>
          </li>
        )}
        <li className='success-page-list-item'>
          <span className='success-page-label'>Payment status:</span>
          <span className={`success-page-status ${statusClassName}`}>{planStatus}</span>
        </li>
        {planExpiration && (
          <li className='success-page-list-item'>
            <span className='success-page-label'>Expiration date:</span>
            <span className='success-page-value'>{planExpiration}</span>
          </li>
        )}
      </ul>
      {daysLeft && <b className='success-page-days'>{daysLeft}</b>}
      <p className='success-page-description'>{planNote}</p>
      <Button onClick={handleButtonClick} outline block size='lg'>
        OK
      </Button>
      <span className='success-page-guarantee'>
        * Satisfaction Guaranteed. If you're not completely happy with your upgrade, let us know and
        we'll issue a{' '}
        <a
          className='success-page-link'
          target='_blank'
          rel='noopener noreferrer'
          href='https://www.divorcepath.com/guarantee'
        >
          refund
        </a>
        .
      </span>
      <a
        className='success-page-link privacy'
        href='https://www.divorcepath.com/privacy'
        target='_blank'
        rel='noopener noreferrer'
      >
        Privacy Policy
      </a>
    </AuthPage>
  );
};

export default SuccessPage;
