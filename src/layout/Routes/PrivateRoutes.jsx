import React, { useMemo } from 'react';

import { Route, Redirect, Switch } from 'react-router-dom';
import { LiveChatLoaderProvider, Intercom } from 'react-live-chat-loader';

import Layout from 'layout/Layout';

import AccountOverview from 'components/AccountOverview/AccountOverview';
import CompleteAccount from 'components/account/CompleteAccount';
import ConfirmAccount from 'components/account/ConfirmAccount';
import ClientProfile from 'components/ClientProfile/ClientProfile';
import ProProfilePage from 'components/ProProfile/ProProfilePage';
import Alert from 'components/alert/Alert';
import ChooseBillingPlanPage from 'components/billing/ChooseBillingPlanPage';
import SupportCalculationContainer from 'components/calculations/SupportCalculationContainer';
import VerifyEmail from 'components/VerifyEmail';
import SuccessPage from 'components/billing/SuccessPage';
import ShareCalculationContainer from 'components/calculations/shareCalculation/ShareCalculationContainer';

import useCurrentUser from 'hooks/useCurrentUser';

const PrivateRoutes = () => {
  const { me } = useCurrentUser();

  const isClient = useMemo(() => me?.client, [me]);

  const clientProfileName = useMemo(() => me?.client?.profile?.firstName, [me]);
  const proProfileName = useMemo(() => me?.professional?.profile?.firstName, [me]);

  if (!clientProfileName && !proProfileName) {
    const hasSavedData = !!JSON.parse(
      localStorage.getItem('SPOUSAL') || localStorage.getItem('CHILD'),
    );

    if (hasSavedData && isClient) {
      return (
        <Layout>
          <LiveChatLoaderProvider providerKey='y5wcnvw1' provider='intercom'>
            <Intercom color='#6800D9' />
            <Switch>
              <Route path='/confirm-account' component={ConfirmAccount} />
              <Route path='/complete-account' component={CompleteAccount} />
              <Route path='/subscription' component={SuccessPage} />
              <Route
                path='/shared-calculation/:calculationId'
                component={ShareCalculationContainer}
              />
              <Route render={() => <Redirect to='/confirm-account' />} />
            </Switch>
          </LiveChatLoaderProvider>
        </Layout>
      );
    }

    return (
      <Layout>
        <LiveChatLoaderProvider providerKey='y5wcnvw1' provider='intercom'>
          <Intercom color='#6800D9' />
          <Switch>
            <Route path='/complete-account' component={CompleteAccount} />
            <Route path='/subscription' component={SuccessPage} />
            <Route
              path='/shared-calculation/:calculationId'
              component={ShareCalculationContainer}
            />
            <Route render={() => <Redirect to='/complete-account' />} />
          </Switch>
        </LiveChatLoaderProvider>
      </Layout>
    );
  }

  return (
    <Layout>
      <LiveChatLoaderProvider providerKey='y5wcnvw1' provider='intercom'>
        <Intercom color='#6800D9' />
        <Switch>
          <Route exact path='/' component={AccountOverview} />

          <Route path='/plans' component={ChooseBillingPlanPage} />

          <Route path='/profile' component={isClient ? ClientProfile : ProProfilePage} />
          <Route path='/clients/:clientId/edit' component={ClientProfile} />

          <Route path='/email/:token' component={VerifyEmail} />

          <Route path='/complete-account' component={CompleteAccount} />

          <Route path='/subscription' component={SuccessPage} />

          <Route
            path={[
              '/shared-calculation/:calculationId',
              '/shared-calculation/:calculationId/:clientId',
            ]}
            component={ShareCalculationContainer}
          />

          <Route
            exact
            path={[
              '/child-support',
              '/child-support/:calculationId',
              '/child-support/:clientId/create',
              '/child-support/:calculationId/:clientId',

              '/spousal-support',
              '/spousal-support/:calculationId',
              '/spousal-support/:clientId/create',
              '/spousal-support/:calculationId/:clientId',
            ]}
            component={SupportCalculationContainer}
          />

          <Route
            path='/calculation/shared/sign-in/:sharedToken'
            component={ShareCalculationContainer}
          />

          <Route render={() => <Redirect to='/' />} />
        </Switch>
        <Alert />
      </LiveChatLoaderProvider>
    </Layout>
  );
};

export default PrivateRoutes;
