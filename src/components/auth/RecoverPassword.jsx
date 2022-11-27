/* eslint-disable no-alert */
import React, { useCallback } from 'react';

import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';

import AuthPage from 'layout/AuthPage';

import TextInput from 'components/common/inputs/TextInput';
import Button from 'components/common/Button';

import RESET_PASSWORD from 'graphql/mutations/auth/resetPassword';

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Is this email address correct?')
    .required('Need an email address here'),
});

const RecoverPassword = () => {
  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD);

  const handleSubmitForm = useCallback(
    ({ email }) => {
      const variables = {
        data: {
          email,
        },
      };
      const trafficType =
        window.location.hostname === 'www.divorcepath.com' ? 'external' : 'internal';
      resetPassword({ variables })
        .then(() => {
          window.alert(
            'We have sent you a message to reset your password. Please check your mail.',
          );
          const dataLayer = window.dataLayer || [];
          dataLayer.push({
            event: 'recover_password',
            traffic_type: trafficType,
          });
        })
        .catch(err =>
          err.graphQLErrors.map(({ message }) => {
            toast.error(message);
            const dataLayer = window.dataLayer || [];
            dataLayer.push({
              event: 'recover_password_failed',
              traffic_type: trafficType,
            });
            return null;
          }),
        );
    },
    [resetPassword],
  );

  return (
    <AuthPage>
      <div className='text-center mb-5'>
        <h6 className='h3'>Recover Password</h6>
        <p className='text-muted mb-0'>
          Enter your email address below to receive a link to reset your password.
        </p>
      </div>

      <Formik
        initialValues={{ email: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmitForm}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({ errors, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <TextInput
              name='email'
              className='form-control'
              placeholder='name@example.com'
              prepend='user'
              label='Email Address'
            />

            <Button
              type='submit'
              className='btn-block'
              size='lg'
              disabled={!!Object.keys(errors).length || loading}
            >
              Recover Password
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

export default RecoverPassword;
