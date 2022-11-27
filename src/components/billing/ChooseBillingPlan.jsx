import React, { useCallback, Fragment, useEffect, useState, useMemo } from 'react';

import { useLocation } from 'react-router-dom';
import { Redirect } from 'react-router';
import { useMutation } from '@apollo/client';
import { Elements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-toastify';

import { CANCEL_PLAN } from 'components/modals/profile/CancelPlanModal';

import CurrentPlan from 'components/billing/CurrentPlan';
import PlanCards from 'components/billing/PlanCards';
import UpdatePaymentMethod from 'components/billing/UpdatePaymentMethod';

import useCurrentUser from 'hooks/useCurrentUser';
import useModal from 'hooks/useModal';
import usePlanForAnalytics from 'hooks/usePlanForAnalytics';

import customGet from 'utils/get';

import CREATE_CHECKOUT_SESSION from 'graphql/mutations/plans/createCheckoutSession';
import UPDATE_SUBSCRIPTION from 'graphql/mutations/plans/updateSubscription';
import CANCEL_SUBSCRIPTION from 'graphql/mutations/plans/cancelSubscription';

const ChooseBillingPlan = () => {
  const { pathname } = useLocation();
  const stripe = useStripe();
  const { me, refetchMe, isActiveSub, isOrgFounder, isPro, isPlanFullyUpgraded } = useCurrentUser();
  const getPlanForAnalytics = usePlanForAnalytics();

  const [isSubscriptionOrdered, setIsSubscriptionOrdered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newChosenPlanId, setNewChosenPlanId] = useState(null);

  const [createCheckoutSession, { loading: createLoading }] = useMutation(CREATE_CHECKOUT_SESSION);
  const [updateSubscription, { loading: updateLoading }] = useMutation(UPDATE_SUBSCRIPTION);
  const [cancelSubscription, { loading: cancelLoading }] = useMutation(CANCEL_SUBSCRIPTION);
  const { open } = useModal(CANCEL_PLAN);

  useEffect(() => {
    if (pathname.includes('profile/billing') && !me?.subscription) {
      setTimeout(() => {
        refetchMe();
      }, 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chosenPlanId = useMemo(
    () => (isPlanFullyUpgraded ? customGet(me, 'subscription.plan.id', 'FREE') : 'FREE'),
    [isPlanFullyUpgraded, me],
  );

  const checkoutEvent = useCallback(
    planCode => {
      // trigger checkout event for google analytics
      const dataLayer = window.dataLayer || [];
      dataLayer.push({ ecommerce: null });

      const plan = getPlanForAnalytics(planCode, isPro);

      dataLayer.push({
        event: 'begin_checkout',
        traffic_type: window.location.hostname === 'www.divorcepath.com' ? 'external' : 'internal',
        ecommerce: {
          items: plan,
        },
      });
    },
    [getPlanForAnalytics, isPro],
  );

  const handleSub = useCallback(
    planCode => {
      setNewChosenPlanId(planCode);
      localStorage.setItem('isNotified', false);

      const variables = {
        input: {
          planCode,
        },
      };
      checkoutEvent(planCode);
      createCheckoutSession({ variables }).then(r => {
        stripe
          .redirectToCheckout({ sessionId: r.data.createCheckoutSession })
          .then(result => result)
          .finally(() => setNewChosenPlanId(null));
      });
    },
    [stripe, createCheckoutSession, checkoutEvent],
  );

  const handleUpdateSub = useCallback(
    planCode => {
      setNewChosenPlanId(planCode);
      localStorage.setItem('isNotified', false);

      const variables = { input: { planCode } };
      checkoutEvent(planCode);
      // const oldSubscriptionValue = lookup value
      updateSubscription({ variables }).then(result => {
        toast.success('Your subscription was successfully updated.');
        const tagManagerArgs = {
          event: 'update_subscription',
          subscription: result.data.updateSubscription.accountSubscription.plan.id,
          status: result.data.updateSubscription.accountSubscription.status,
          isPro: result.data.updateSubscription.accountSubscription.plan.isPro,
        };
        const dataLayer = window.dataLayer || [];
        dataLayer.push({ ecommerce: null });
        dataLayer.push(tagManagerArgs);

        setLoading(true);
        refetchMe()
          .then(() => setIsSubscriptionOrdered(true))
          .finally(() => setLoading(false));
      });
    },
    [updateSubscription, checkoutEvent, refetchMe],
  );

  const handleCancelSub = useCallback(() => {
    if (!isPro) return open();

    setNewChosenPlanId('FREE');

    return cancelSubscription()
      .then(() => {
        setLoading(true);

        refetchMe()
          .then(() => open())
          .finally(setLoading(false));
      })
      .catch(err =>
        err.graphQLErrors.map(({ message }) => {
          if (message === 'Subscription is already canceled') open();

          return toast.error(message);
        }),
      );
  }, [cancelSubscription, isPro, open, refetchMe]);

  const handleClick = useCallback(
    planCode => {
      if (planCode === 'FREE') return handleCancelSub();

      if (isActiveSub) {
        return handleUpdateSub(planCode);
      }

      return handleSub(planCode);
    },
    [handleCancelSub, isActiveSub, handleSub, handleUpdateSub],
  );

  if (isSubscriptionOrdered) return <Redirect to='/subscription' />;

  return (
    <Fragment>
      <CurrentPlan subscription={me?.subscription} />

      <PlanCards
        isUserLawyer={isPro}
        isOrgMember={!isOrgFounder && !!me.professional?.organization}
        chosenPlanId={chosenPlanId}
        handleClick={handleClick}
        isActiveSub={isActiveSub}
        loading={createLoading || updateLoading || cancelLoading || loading}
        newChosenPlanId={newChosenPlanId}
      />

      <UpdatePaymentMethod stripe={stripe} isActiveSub={isActiveSub} />
    </Fragment>
  );
};

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const StripeInjected = () => (
  <Elements stripe={stripePromise}>
    <ChooseBillingPlan />
  </Elements>
);

export default StripeInjected;
