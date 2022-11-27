import React, { useCallback, useState, Fragment, useMemo } from 'react';

import { useParams, Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import { useQuery } from '@apollo/client';
import { Formik, Form } from 'formik';
import * as yup from 'yup';

import AuthPage from 'layout/AuthPage';

import TextInput from 'components/common/inputs/TextInput';
import Button from 'components/common/Button';

import useCurrentUser from 'hooks/useCurrentUser';

import ORGANIZATION_INVITE from 'graphql/queries/organization/organizationInvite';
import SHARED_SUPPORT_CALCULATION_BY_TOKEN from 'graphql/queries/calculations/sharedSupportCalculationByToken';

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Is this email address correct?')
    .required('Need an email address here.'),
  password: yup.string().required('Need a password here.'),
});

const SignIn = () => {
  const { handleSignIn } = useCurrentUser();
  const { push } = useHistory();
  const [loading, setLoading] = useState(false);

  // handle invitations to existing users
  const { token, sharedToken } = useParams();

  const query = useMemo(
    () => (token ? ORGANIZATION_INVITE : SHARED_SUPPORT_CALCULATION_BY_TOKEN),
    [token],
  );

  const options = useMemo(
    () =>
      token
        ? { variables: { where: { token } }, skip: !token }
        : {
            variables: { where: { shareToken: sharedToken } },
            skip: !sharedToken,
          },
    [sharedToken, token],
  );

  const { data, loading: dataLoading } = useQuery(query, options);

  const sharedEmail = useMemo(() => {
    if (dataLoading) {
      setLoading(true);
    } else {
      setLoading(false);
      return data?.sharedSupportCalculationByToken?.share?.email;
    }
  }, [data?.sharedSupportCalculationByToken?.share?.email, dataLoading]);

  const invite = data?.organizationInvite;
  const invitedByUser = `${invite?.inviter.professional?.profile?.firstName} 
  ${invite?.inviter?.professional?.profile?.lastName}`;

  const initialValues = useMemo(
    () => ({
      email: data?.organizationInvite?.email || sharedEmail || '',
      password: '',
    }),
    [data?.organizationInvite?.email, sharedEmail],
  );

  const inviteToOrganization = invite?.inviter?.professional?.organization?.name;

  const InviteDescription = useCallback(() => {
    if (sharedToken && !sharedEmail && !dataLoading) {
      return (
        <Fragment>
          This invitation is no longer available. Please contact the person who sent you the
          calculation. If you think this is an error, please contact technical support at
          <a href='mailto:help@divorcepath.com'> help@divorcepath.com</a>
        </Fragment>
      );
    }

    if (token && !invite) {
      const dataLayer = window.dataLayer || [];
      dataLayer.push({
        event: 'expired_pro_invitation',
        traffic_type: window.location.hostname === 'www.divorcepath.com' ? 'external' : 'internal',
      });

      return (
        <Fragment>
          This invitation is no longer available. Please contact your organization’s administrator
          for more information. If you think this is an error, please contact technical support at
          <a href='mailto:help@divorcepath.com'> help@divorcepath.com</a>
        </Fragment>
      );
    }

    if (token && invite) return `${invitedByUser} invited you to join ${inviteToOrganization}`;

    return 'Find your path.';
  }, [token, invite, sharedToken, sharedEmail, dataLoading, invitedByUser, inviteToOrganization]);

  const handleSubmitForm = useCallback(
    ({ email, password }) => {
      localStorage.removeItem('authToken');

      setLoading(true);
      handleSignIn({ data: { email, password } }, sharedToken).finally(() => {
        setLoading(false);

        if (sharedToken) {
          push(`/calculation/shared/sign-in/${sharedToken}`);
        }
      });
    },
    [handleSignIn, push, sharedToken],
  );

  return (
    <AuthPage>
      <div className='text-center mb-5'>
        <h6 className='h3'>Welcome back</h6>
        <p className='text-muted mb-2'>
          <InviteDescription />
        </p>
        <p className='text-muted mb-0'>Sign in to your account to continue</p>
      </div>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={handleSubmitForm}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({ values }) => (
          <Form>
            <TextInput
              type='email'
              name='email'
              label='Email address'
              placeholder='name@example.com'
              prepend='user'
              disabled={(token && invite && values.email) || (sharedToken && sharedEmail)}
              isDebounced={false}
            />

            <div className='password-container'>
              <Link to='/recover-password' className='small text-unerline--dashed'>
                Lost password?
              </Link>
              <TextInput
                type='password'
                label='Password'
                name='password'
                placeholder='******'
                prepend='user'
                isDebounced={false}
              />
            </div>

            <div className='text-center mb-3'>
              <Button type='submit' name='login' size='lg' className='btn-block' disabled={loading}>
                Sign in
              </Button>
            </div>

            <div className='text-center'>
              <small>Not registered? </small>
              <Link to='/sign-up' className='small font-weight-bold'>
                Create account
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </AuthPage>
  );
};

export default SignIn;
