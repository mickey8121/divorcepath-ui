/* eslint-disable no-alert */
import React, { useCallback } from 'react';

import { useMutation } from '@apollo/client';
import * as yup from 'yup';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { Form } from 'reactstrap';

import TextInput from 'components/common/inputs/TextInput';
import Button from 'components/common/Button';

import useCurrentUser from 'hooks/useCurrentUser';

import CHANGE_PASSWORD from 'graphql/mutations/user/changePassword';
import RESET_PASSWORD from 'graphql/mutations/auth/resetPassword';

const lawyerSettingsSchema = yup.object().shape({
  oldPassword: yup
    .string()
    .min(6, 'Use at least six characters.')
    .required('Old password is required'),
  newPassword: yup
    .string()
    .min(6, 'Use at least six characters.')
    .required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords are not matched')
    .required('Confirm password is required'),
});

const initialValues = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const confirmMessage =
  "Are you sure you want to change your password? We'll send you a message to change your password, and you'll be redirected to the login screen.";
const successMessage = 'We have sent you a message to reset your password. Please check your mail.';

const ChangePasswordForm = () => {
  const { me, logout } = useCurrentUser();

  const [changePassword, { loading }] = useMutation(CHANGE_PASSWORD);
  const [resetPassword] = useMutation(RESET_PASSWORD);

  const handleSubmitForm = useCallback(
    ({ oldPassword, newPassword, confirmPassword }, { resetForm }) => {
      if (newPassword.trim() === confirmPassword.trim() && oldPassword) {
        const variables = {
          data: {
            oldPassword,
            password: newPassword,
          },
        };

        changePassword({ variables })
          .then(() => resetForm())
          .catch(err => err.graphQLErrors.map(({ message }) => toast.error(message)));
      }
    },
    [changePassword],
  );

  const handleForgotPasswordClick = useCallback(async () => {
    if (window.confirm(confirmMessage)) {
      logout();

      try {
        await resetPassword({ variables: { data: { email: me?.email } } });

        toast.success(successMessage);
      } catch (e) {
        toast.error(e.message);
      }
    }
  }, [me, resetPassword, logout]);

  return (
    <Formik
      enableReinitialize
      validateOnBlur={false}
      initialValues={initialValues}
      validationSchema={lawyerSettingsSchema}
      onSubmit={handleSubmitForm}
    >
      {({ handleSubmit }) => (
        <Form className='update-form change-password-form'>
          <div className='inputs-container'>
            <div className='left-side'>
              <h4 className='title'>Change password</h4>
              <p className='subtitle'>Update your password using the form below.</p>
            </div>
            <div className='right-side'>
              <TextInput
                size='md'
                name='oldPassword'
                label='Old password'
                type='password'
                placeholder='Old password'
              />
              <TextInput
                size='md'
                name='newPassword'
                label='New password'
                type='password'
                placeholder='New password'
              />
              <TextInput
                size='md'
                name='confirmPassword'
                label='Confirm password'
                type='password'
                placeholder='Confirm password'
              />

              <div className='btn-group-form' role='group'>
                <Button
                  size='md'
                  className='update-password'
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  Update password
                </Button>
                <Button
                  onClick={handleForgotPasswordClick}
                  className='forgot-password'
                  color='secondary'
                  size='md'
                >
                  I forgot my password
                </Button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ChangePasswordForm;
