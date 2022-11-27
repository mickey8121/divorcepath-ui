/* eslint-disable no-alert */
import React, { useCallback } from 'react';

import { useMutation } from '@apollo/client';
import { Link, useParams } from 'react-router-dom';
import { Formik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';

import AuthPage from 'layout/AuthPage';

import TextInput from 'components/common/inputs/TextInput';
import Button from 'components/common/Button';

import useCurrentUser from 'hooks/useCurrentUser';

import CHANGE_PASSWORD from 'graphql/mutations/user/changePassword';

const validationSchema = yup.object().shape({
  password: yup.string().min(6, 'Use at least six characters.').required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords are not matched')
    .required('Confirm password is required'),
});

const initialValues = {
  password: '',
  confirmPassword: '',
};

const ResetPassword = () => {
  const { token } = useParams();

  const { refetchMe } = useCurrentUser();

  const [changePassword, { loading }] = useMutation(CHANGE_PASSWORD);

  const handleSubmitForm = useCallback(
    ({ password }) => {
      const variables = {
        data: {
          token,
          password,
        },
      };

      changePassword({ variables })
        .then(({ data }) => {
          localStorage.setItem('authToken', data?.changePassword?.token);
          refetchMe();
          const dataLayer = window.dataLayer || [];
          dataLayer.push({
            event: 'reset_password',
            traffic_type:
              window.location.hostname === 'www.divorcepath.com' ? 'external' : 'internal',
          });
          toast.success('Your password has been successfully changed.');
        })
        .catch(err => err.graphQLErrors.map(({ message }) => toast.error(message)));
    },
    [changePassword, token, refetchMe],
  );

  return (
    <AuthPage>
      <div className='text-center mb-5'>
        <h6 className='h3'>Reset Password</h6>
        <p className='text-muted mb-0'>
          Enter your email address below to receive a link to reset your password.
        </p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmitForm}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({ errors, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            {['password', 'confirmPassword'].map(password => (
              <TextInput
                key={password}
                type='password'
                label={password === 'password' ? 'Password' : 'Confirm Password'}
                name={password}
                placeholder='******'
                prepend='user'
              />
            ))}

            <Button
              type='submit'
              className='btn-block'
              disabled={!!Object.keys(errors).length || loading}
            >
              Reset Password
            </Button>

            <div className='text-center mt-3'>
              <small>Remember your password? </small>
              <Link to='/sign-in' className='small font-weight-bold'>
                Log In
              </Link>
            </div>
          </form>
        )}
      </Formik>
    </AuthPage>
  );
};

export default ResetPassword;
