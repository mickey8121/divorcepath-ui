import React, { useCallback } from 'react';

import { useParams } from 'react-router';
import { Button } from 'reactstrap';
import { Formik } from 'formik';
import { Link } from 'react-router-dom';

import AuthPage from 'layout/AuthPage';

import TextInput from 'components/common/inputs/TextInput';

import useCurrentUser from 'hooks/useCurrentUser';

const AcceptInvitationPage = () => {
  const { type } = useParams();

  const { handleSignUp } = useCurrentUser();

  const handleSubmitForm = useCallback(
    ({ email, password, role }) => {
      const variables = {
        data: {
          email,
          password,
          accountType: role,
        },
      };

      handleSignUp(variables);
    },
    [handleSignUp],
  );

  return (
    <AuthPage>
      {type === 'signin' && <div>sign in</div>}
      {type === 'signup' && (
        <div>
          <div className='text-center mb-5'>
            <h6 className='h3'>Create your account</h6>
            <p className='text-muted mb-0'>Find your path to a new life.</p>
          </div>

          <Formik
            enableReinitialize
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={{}}
            // validationSchema={schema}
            onSubmit={handleSubmitForm}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <TextInput
                  prepend='user'
                  name='email'
                  label='Email'
                  placeholder='name@example.com'
                />
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
                <div className='custom-control custom-checkbox my-4'>
                  <input
                    className='custom-control-input'
                    name='registerCheckbox'
                    id='customCheckRegister'
                    // onChange={() => setChecked(!checked)}
                    type='checkbox'
                  />
                  <label className='custom-control-label' htmlFor='customCheckRegister'>
                    <span>
                      I agree to the{' '}
                      <a
                        href='https://www.divorcepath.com/terms'
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        Terms and Conditions
                      </a>{' '}
                      and{' '}
                      <a
                        href='https://www.divorcepath.com/privacy'
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        Privacy Policy
                      </a>
                      .
                    </span>
                  </label>
                </div>
                <div className='row align-items-center'>
                  <div className='col-sm-7'>
                    <Button
                      type='submit'
                      name='login'
                      size='lg'
                      className='mb-3 mb-sm-0'
                      // disabled={!checked || loading}
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
        </div>
      )}
    </AuthPage>
  );
};

export default AcceptInvitationPage;
