/* eslint-disable no-shadow */
import React, { useState, useCallback, useMemo, Fragment } from 'react';

import { useHistory, Link, useLocation, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { Formik } from 'formik';
import * as yup from 'yup';
import classnames from 'classnames';
// payment modules
import { Elements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// components
import AuthPage from 'layout/AuthPage';

import Button from 'components/common/Button';
import TextInput from 'components/common/inputs/TextInput';
import ToggleButtons from 'components/common/ToggleButtons';

import ShareSignUp from 'components/auth/components/ShareSignUp';
import Agreements from 'components/auth/components/Agreements';

import useCurrentUser from 'hooks/useCurrentUser';
import usePlanForAnalytics from 'hooks/usePlanForAnalytics';

import ORGANIZATION_INVITE from 'graphql/queries/organization/organizationInvite';
import CREATE_CHECKOUT_SESSION from 'graphql/mutations/plans/createCheckoutSession';

const passwords = ['password', 'confirmPassword'];

const buttons = [
  {
    disabled: false,
    value: 'CLIENT',
    label: 'Personal',
  },
  {
    disabled: false,
    value: 'PROFESSIONAL',
    label: 'Professional',
  },
];

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  role: yup.string().oneOf(['CLIENT', 'PROFESSIONAL']).required('Select a role'),
  password: yup.string().min(6, 'Use at least six characters.').required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords are not matched')
    .required('Confirm password is required'),
});

const trafficType = window.location.hostname === 'www.divorcepath.com' ? 'external' : 'internal';

const signupEvent = method => {
  // trigger signup event for google analytics
  const dataLayer = window.dataLayer || [];
  dataLayer.push({
    event: 'sign_up',
    traffic_type: trafficType,
    method,
  });
};

const SignUp = () => {
  const stripe = useStripe();
  const { search } = useLocation();
  const { token, sharedToken } = useParams();
  const { handleSignUp } = useCurrentUser();
  const { push } = useHistory();
  const getPlanForAnalytics = usePlanForAnalytics();

  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createCheckoutSession] = useMutation(CREATE_CHECKOUT_SESSION);
  const { data } = useQuery(ORGANIZATION_INVITE, { variables: { where: { token } }, skip: !token });

  const searchParams = useMemo(() => new URLSearchParams(search), [search]);
  const role = useMemo(() => searchParams.get('role'), [searchParams]);
  const planId = useMemo(() => (token ? null : localStorage.getItem('planCode')), [token]);

  const invite = useMemo(() => data?.organizationInvite, [data]);

  const userRole = useMemo(() => {
    const roleFromLs = !!JSON.parse(localStorage.getItem('isProfessional'));

    return role || invite || roleFromLs ? 'PROFESSIONAL' : 'CLIENT';
  }, [role, invite]);

  const initialValues = useMemo(
    () => ({
      email: invite?.email || '',
      role: userRole,
      password: '',
      confirmPassword: '',
    }),
    [invite, userRole],
  );

  const invitedByUser = useMemo(
    () =>
      `${invite?.inviter.professional?.profile?.firstName} ${invite?.inviter?.professional?.profile?.lastName}`,
    [invite],
  );

  const inviteToOrganization = useMemo(
    () => invite?.inviter?.professional?.organization?.name,
    [invite],
  );

  const checkoutEvent = useCallback(
    planCode => {
      // trigger checkout event for google analytics
      const dataLayer = window.dataLayer || [];
      dataLayer.push({ ecommerce: null });

      const plan = getPlanForAnalytics(planCode, userRole === 'PROFESSIONAL');

      dataLayer.push({
        event: 'begin_checkout',
        traffic_type: trafficType,
        ecommerce: {
          items: plan,
        },
      });
    },
    [getPlanForAnalytics, userRole],
  );

  const handleSub = useCallback(
    planCode => {
      const variables = {
        input: {
          planCode,
        },
      };
      checkoutEvent(planCode);
      if (planCode === 'FREE') {
        push('/complete-account');
      } else {
        createCheckoutSession({ variables }).then(r => {
          stripe
            .redirectToCheckout({ sessionId: r.data.createCheckoutSession })
            .then(result => result);
        });
      }
    },
    [stripe, createCheckoutSession, checkoutEvent, push],
  );

  const handleSubmitForm = useCallback(
    ({ email, password, role }) => {
      setLoading(true);

      const variables = {
        data: {
          email,
          password,
          accountType: role,
        },
      };

      if (token && invite) {
        variables.data.inviteToken = token;
        variables.data.accountType = 'PROFESSIONAL';
      }

      handleSignUp(variables).finally(() => {
        setLoading(false);
        signupEvent('email');
        if (token && invite) {
          const dataLayer = window.dataLayer || [];
          dataLayer.push({
            event: 'accept_pro_invite',
            traffic_type: trafficType,
          });
        }
        if (planId && planId !== 'FREE') {
          handleSub(planId);
        }
      });
    },
    [handleSignUp, token, invite, handleSub, planId],
  );

  const InviteDescription = useCallback(() => {
    if (token && !invite)
      return (
        <Fragment>
          This invitation is no longer available. Please contact your organization’s administrator
          for more information. If you think this is an error, please contact technical support at
          <a href='mailto:help@divorcepath.com'> help@divorcepath.com</a>
        </Fragment>
      );

    if (token && invite) return `${invitedByUser} invited you to join ${inviteToOrganization}`;

    return 'Find your path.';
  }, [invite, token, inviteToOrganization, invitedByUser]);

  const showToggleButtons = useMemo(() => !token && !planId, [token, planId]);

  return (
    <AuthPage noInvite={!token || !invite || !sharedToken}>
      {sharedToken ? (
        <ShareSignUp sharedToken={sharedToken} />
      ) : (
        <Fragment>
          <div className={classnames('text-center', { 'mb-5': !token || invite })}>
            <h6 className='h3'>Create your account</h6>
            <p className='text-muted mb-0'>
              <InviteDescription />
            </p>
          </div>

          {((token && invite) || (!token && !invite)) && (
            <Formik
              enableReinitialize
              validateOnBlur={false}
              validateOnChange={false}
              initialValues={initialValues}
              validationSchema={schema}
              onSubmit={handleSubmitForm}
            >
              {({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  {showToggleButtons && (
                    <ToggleButtons
                      label='Will you use Divorcepath personally for yourself, or to help multiple clients as a professional?'
                      labelClassName='form-label mb-3'
                      name='role'
                      buttons={buttons}
                    />
                  )}
                  <TextInput
                    prepend='user'
                    name='email'
                    label='Email'
                    placeholder='name@example.com'
                    disabled={token && invite}
                  />
                  {passwords.map(password => (
                    <TextInput
                      key={password}
                      type='password'
                      label={password === 'password' ? 'Password' : 'Confirm Password'}
                      name={password}
                      placeholder='******'
                      prepend='user'
                    />
                  ))}

                  <Agreements checked={checked} setChecked={setChecked} />

                  <div className='row align-items-center mt-3'>
                    <div className='col-sm-7'>
                      <Button
                        type='submit'
                        name='login'
                        size='lg'
                        className='mb-3 mb-sm-0'
                        disabled={!checked || loading}
                      >
                        Create account
                      </Button>
                    </div>
                    <div className='col-sm-5 text-sm-right'>
                      <span className='small d-sm-block d-md-inline'>Already registered? </span>
                      <Link to='/sign-in' className='small login-link'>
                        Sign in
                      </Link>
                    </div>
                  </div>
                </form>
              )}
            </Formik>
          )}
        </Fragment>
      )}
    </AuthPage>
  );
};

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const StripeInjected = () => (
  <Elements stripe={stripePromise}>
    <SignUp />
  </Elements>
);

export default StripeInjected;
