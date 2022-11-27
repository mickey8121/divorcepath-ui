import React, { lazy, Suspense } from 'react';

import { Route, Switch, Redirect } from 'react-router-dom';
import { LiveChatLoaderProvider, Intercom } from 'react-live-chat-loader';

import Layout from 'layout/Layout';

import Loading from 'components/common/Loading';

import PublicSupportCalculationsContainer from 'components/calculations/public/PublicSupportCalculationsContainer';
// import ShareCalculationContainer from 'components/calculations/ShareCalculationContainer';

const Upgrade = lazy(() => import('components/billing/Upgrade'));
const SignIn = lazy(() => import('components/auth/SignIn'));
const SignUp = lazy(() => import('components/auth/SignUp'));
const RecoverPassword = lazy(() => import('components/auth/RecoverPassword'));
const ResetPassword = lazy(() => import('components/auth/ResetPassword'));
const VerifyEmail = lazy(() => import('components/VerifyEmail'));

const PublicRoutes = () => (
  <Layout>
    <Suspense fallback={<Loading page />}>
      <LiveChatLoaderProvider providerKey='y5wcnvw1' provider='intercom'>
        <Intercom color='#6800D9' />
        <Switch>
          <Route
            path={[
              '/sign-up',
              '/organization/invite/signup/:token',
              '/calculation/shared/sign-up/:sharedToken',
            ]}
            component={SignUp}
          />

          <Route
            path={[
              '/sign-in',
              '/organization/invite/signin/:token',
              '/calculation/shared/sign-in/:sharedToken',
            ]}
            component={SignIn}
          />
          <Route path='/upgrade' component={Upgrade} />
          <Route path='/recover-password' component={RecoverPassword} />
          <Route path='/reset-password/:token' component={ResetPassword} />
          <Route path='/email/:token' component={VerifyEmail} />
          <Route
            exact
            path={['/child-support', '/spousal-support']}
            component={PublicSupportCalculationsContainer}
          />
          <Route render={() => <Redirect to='/sign-in' />} />
        </Switch>
      </LiveChatLoaderProvider>
    </Suspense>
  </Layout>
);

export default PublicRoutes;
