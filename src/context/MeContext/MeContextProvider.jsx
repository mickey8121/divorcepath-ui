import React, { useEffect, useCallback, useMemo, useState } from 'react';

import { useMutation, useApolloClient } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

import MeContext from 'context/MeContext/MeContext';

import getUserName from 'utils/getUserName';
import revokeToken from 'utils/revokeToken';

import SIGN_IN from 'graphql/mutations/auth/signIn';
import SIGN_UP from 'graphql/mutations/auth/signUp';
import VERIFY_EMAIL from 'graphql/mutations/user/verifyEmail';
import ME from 'graphql/queries/user/me';

const DOMAIN = 'localhost';
const dataLayer = window.dataLayer || [];

const MeContextProvider = ({ children, data, loading, refetch }) => {
  const { push } = useHistory();
  const apolloClient = useApolloClient();

  const [currentPeriodPlanLength, setCurrentPeriodPlanLength] = useState(
    parseInt(data?.me?.subscription?.plan?.id?.match(/\d+/), 10) || null,
  );

  const [signIn] = useMutation(SIGN_IN);
  const [signUp] = useMutation(SIGN_UP);
  const [verifyEmail] = useMutation(VERIFY_EMAIL);

  useEffect(() => {
    const user = {
      email: data?.me?.email,
      name: data?.me?.name,
      subscription: data?.me?.subscription,
    };

    document.cookie = `user=${JSON.stringify(user)}; domain=${DOMAIN}; Path=/;`;
  }, [data]);

  useEffect(() => {
    const { me } = data || {};
    const userName = getUserName(me || {}, false);

    if (me?.id && userName) {
      const { email = null, professional, client, subscription } = me || {};

      const phone = client?.profile?.phone || professional?.profile?.phone || null;
      const role = professional?.type || 'CLIENT';
      const { id = null, name = null } = professional?.organization || {};

      const subscriptionType =
        subscription?.plan?.id || professional?.organization?.subscriptionType;

      const tagManagerArgs = {
        user: {
          id: me.id || null,
          name: userName || null,
          subscription: subscriptionType || null,
          role,
          phone,
          email,
          mouseflow: window.mouseflow?.getSessionId() || null,
          company: professional?.id ? { id, name } : null,
        },
      };
      dataLayer.push(tagManagerArgs);

      window.intercomSettings = {
        app_id: 'y5wcnvw1',
        custom_launcher_selector: '#intercom_link',
        user_id: me.id || null,
        company: professional?.id ? { id, name } : null,
        name: userName,
        subscriptionType: subscriptionType || null,
        mouseflow: window.mouseflow?.getSessionId() || null,
        email,
        phone,
        role,
      };
    }
  }, [data]);

  const logout = useCallback(() => {
    revokeToken();

    // trigger logout event for google analyticsч
    dataLayer.push({
      event: 'logout',
      traffic_type: window.location.hostname === 'www.divorcepath.com' ? 'external' : 'internal',
    });

    document.cookie = `user=; domain=${DOMAIN}; Path=/;`;
    localStorage.removeItem('authToken');
    localStorage.removeItem('isNotified');
    localStorage.removeItem('detailsOpen');

    apolloClient.writeQuery({
      query: ME,
      data: {
        me: null,
      },
    });
    apolloClient.cache.reset();

    if (window.Intercom) window.Intercom('shutdown');
  }, [apolloClient]);

  const storageHandler = useCallback(
    e => {
      const isAuth = e.key === 'authToken';

      if (isAuth && !e.newValue && e.oldValue) {
        logout();
      }

      if (isAuth && e.newValue && !e.oldValue) {
        refetch();
      }
    },
    [logout, refetch],
  );

  useEffect(() => {
    window.addEventListener('storage', storageHandler);

    return () => window.removeEventListener('storage', storageHandler);
  }, [storageHandler]);

  const handleSignIn = useCallback(
    (
      variables, // options
    ) =>
      signIn({ variables })
        .then(r => {
          localStorage.setItem('authToken', r.data?.signIn?.token);
          localStorage.removeItem('isProfessional');
          let event = 'login';
          try {
            apolloClient.writeQuery({
              query: ME,
              data: {
                me: r.data?.signIn.user,
              },
            });
          } catch (error) {
            toast.error(error.message);
            event = 'login_failed';
            // trigger logout event for google analytics
          } finally {
            dataLayer.push({
              event,
              method: 'email',
              traffic_type:
                window.location.hostname === 'www.divorcepath.com' ? 'external' : 'internal',
            });
          }

          if (localStorage.getItem('verify-email')) {
            const token = localStorage.getItem('verify-email');

            verifyEmail({ variables: { data: { token } } })
              .then(() => {
                localStorage.removeItem('verify-email');
                push('/', {
                  isVerified: true,
                });
              })
              .catch();
          }
        })
        .catch(err => err.graphQLErrors?.map(({ message }) => toast.error(message))),
    [apolloClient, signIn, push, verifyEmail],
  );

  const handleSignUp = useCallback(
    variables =>
      signUp({ variables })
        .then(r => {
          localStorage.setItem('authToken', r.data?.signUp.token);
          localStorage.removeItem('isProfessional');

          try {
            apolloClient.writeQuery({
              query: ME,
              data: {
                me: r?.data?.signUp?.user,
              },
            });
          } catch (error) {
            toast.error(error.message);
          }
        })
        .catch(err => err.graphQLErrors?.map(({ message }) => toast.error(message))),
    [apolloClient, signUp],
  );

  const { subscription, professional, id } = data?.me || {};
  const isNotifiedUser = useMemo(() => data?.me?.subscription?.isUserNotified ?? true, [data]);

  const isPro = useMemo(() => typeof professional?.id === 'string', [professional]);

  const isOrgMember = useMemo(
    () => !!professional?.organization?.members?.find(member => member.user.id === id),
    [professional, id],
  );

  const isOrgFounder = useMemo(
    () => data?.me?.id === professional?.organization?.createdBy?.id,
    [data, professional],
  );

  // TODO: Need to somehow check if your subscription to the organization has expired.
  const isActiveSub = useMemo(() => {
    const { currentPeriodEnd, status } = subscription || {};

    if (['ACTIVE', 'TRIALING'].includes(status)) return true;
    if (isOrgMember && !isOrgFounder) return true;

    return dayjs(currentPeriodEnd).diff(dayjs()) > 0;
  }, [isOrgMember, subscription, isOrgFounder]);

  const isOrgAdmin = useMemo(
    () =>
      professional?.organization?.members?.find(member => member.user.id === id)?.role === 'ADMIN',
    [id, professional],
  );

  const isFreeSub = useMemo(
    () =>
      !loading &&
      (!subscription || (subscription && !subscription?.status === 'ACTIVE')) &&
      !isOrgAdmin,
    [loading, subscription, isOrgAdmin],
  );

  const isChildSpousalSub = useMemo(
    () => !loading && isActiveSub && subscription?.plan?.id?.includes('CHILD_SPOUSAL'),
    [loading, isActiveSub, subscription],
  );

  const isIntakeAdminVisible = useMemo(
    () => professional?.organization && isOrgAdmin,
    [isOrgAdmin, professional],
  );

  const isPlanFullyUpgraded = useMemo(
    () => subscription?.status === 'TRIALING' || subscription?.status === 'ACTIVE',
    [subscription],
  );

  const handleChangeCurrentPlanPeriodLength = useCallback(
    value => setCurrentPeriodPlanLength(value),
    [],
  );

  return (
    <MeContext.Provider
      value={{
        isLoggingIn: loading,
        logout,
        handleSignIn,
        handleSignUp,
        me: data?.me || {},
        refetchMe: refetch,

        isFreeSub,
        isActiveSub,
        isChildSpousalSub,
        isPlanFullyUpgraded,

        isOrgFounder,
        isOrgAdmin,
        isOrgMember,
        isPro,

        currentPeriodPlanLength,
        handleChangeCurrentPlanPeriodLength,
        isNotifiedUser,
        isIntakeAdminVisible,
      }}
    >
      {children}
    </MeContext.Provider>
  );
};

export default MeContextProvider;
