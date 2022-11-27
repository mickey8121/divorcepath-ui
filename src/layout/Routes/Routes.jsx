import React, { useEffect, lazy, Suspense, useCallback, useMemo, useState } from 'react';

import { useQuery, useMutation } from '@apollo/client';
import { useLocation, useHistory } from 'react-router-dom';

import Loading from 'components/common/Loading';

import useConfirm from 'hooks/useConfirm';

import MeContextProvider from 'context/MeContext/MeContextProvider';

import getNewToken from 'utils/getNewToken';

import ME from 'graphql/queries/user/me';
import VERIFY_EMAIL from 'graphql/mutations/user/verifyEmail';

const PrivateRoutes = lazy(() => import('layout/Routes/PrivateRoutes'));
const PublicRoutes = lazy(() => import('layout/Routes/PublicRoutes'));
const ReportRoutes = lazy(() => import('layout/Routes/ReportRoutes'));

const Routes = () => {
  const [isRefreshing, setIsRefreshing] = useState(process.env.NODE_ENV !== 'development');

  const { data, loading, refetch } = useQuery(ME, { fetchPolicy: 'network-only' });
  const user = useMemo(() => data?.me || {}, [data]);

  const [verifyEmail] = useMutation(VERIFY_EMAIL);

  const { pathname } = useLocation();
  const { push } = useHistory();

  const notification = useConfirm();

  const handleRefreshToken = useCallback(async () => {
    await getNewToken();

    const { data: response } = await refetch();

    setIsRefreshing(false);

    if (!response?.me?.id) {
      localStorage.removeItem('authToken');

      push('/sign-in');
    }
  }, [push, refetch]);

  useEffect(
    () => {
      const token = localStorage.getItem('verify-email');

      if (token && user.id) {
        verifyEmail({ variables: { data: { token } } })
          .then(() => push(pathname, { isVerified: true }))
          .catch(() => {
            localStorage.removeItem('verify-email');
            push(pathname);
          });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user],
  );

  useEffect(() => {
    if (localStorage.getItem('hasError')?.includes('true')) {
      notification({
        type: 'ERROR',
        message:
          'Divorcepath reloaded your calculation because of a connection error. Please try your calculation again, and contact support if the problem continues.',
        noButtons: true,
        showOk: true,
      });
    }

    localStorage.removeItem('hasError');
  }, [notification]);

  useEffect(
    () => {
      const isDefineToken = !!localStorage.getItem('authToken');

      if (!isDefineToken) setIsRefreshing(false);

      if (!data?.me && !loading && isDefineToken && process.env.NODE_ENV !== 'development') {
        handleRefreshToken();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loading],
  );

  useEffect(() => {
    if (
      !loading &&
      !data?.me &&
      (pathname.includes('spousal-support') || pathname.includes('child-support')) &&
      !isRefreshing
    ) {
      const path = pathname.includes('spousal-support')
        ? `${process.env.REACT_APP_CALCULATION_REDIRECT_LINK}/spousal-support-calculator`
        : `${process.env.REACT_APP_CALCULATION_REDIRECT_LINK}/child-support-calculator`;

      localStorage.removeItem('authToken');

      document.location.replace(path);
    }
  }, [data, isRefreshing, loading, pathname]);

  useEffect(() => {
    if (data?.me?.id) setIsRefreshing(false);
  }, [data]);

  if (pathname.includes('support-report')) {
    return (
      <Suspense fallback={<Loading page />}>
        <ReportRoutes />
      </Suspense>
    );
  }

  if ((loading && !user.id) || isRefreshing) return <Loading page />;

  return (
    <MeContextProvider data={data} loading={loading} refetch={refetch}>
      {user.id ? (
        <Suspense fallback={<Loading page />}>
          <PrivateRoutes />
        </Suspense>
      ) : (
        <Suspense fallback={<Loading page />}>
          <PublicRoutes />
        </Suspense>
      )}
    </MeContextProvider>
  );
};

export default Routes;
