import React, { Fragment, useCallback, useState, useMemo, useEffect } from 'react';

import classnames from 'classnames';
import { Formik, Form } from 'formik';
import { useQuery } from '@apollo/client';
import * as yup from 'yup';

import ToggleButtons from 'components/common/ToggleButtons';
import TextInput from 'components/common/inputs/TextInput';
import Button from 'components/common/Button';
import Loading from 'components/common/Loading';

import Agreements from 'components/auth/components/Agreements';

import useCurrentUser from 'hooks/useCurrentUser';

import getUserName from 'utils/getUserName';

import SHARED_SUPPORT_CALCULATION_BY_TOKEN from 'graphql/queries/calculations/sharedSupportCalculationByToken';

import { ReactComponent as SeparationLine } from 'img/icons/separation-line.svg';

const buttons = [
  {
    disabled: false,
    value: 'CLIENT',
    label: 'Personal user',
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
});

const ShareSignUp = ({ sharedToken }) => {
  const [checked, setChecked] = useState(false);
  const { handleSignUp } = useCurrentUser();

  const { data, loading: dataLoading } =
    useQuery(SHARED_SUPPORT_CALCULATION_BY_TOKEN, {
      variables: { where: { shareToken: sharedToken } },
      skip: !sharedToken,
    }) || {};

  const { sharedSupportCalculationByToken } = data || {};

  const [loading, setLoading] = useState(dataLoading);

  useEffect(() => {
    if (dataLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [dataLoading]);

  const whoShare = useMemo(
    () =>
      !dataLoading &&
      getUserName(
        sharedSupportCalculationByToken?.share?.sharedBy?.client ||
          sharedSupportCalculationByToken?.share?.sharedBy?.professional,
      ),
    [
      dataLoading,
      sharedSupportCalculationByToken?.share?.sharedBy?.client,
      sharedSupportCalculationByToken?.share?.sharedBy?.professional,
    ],
  );

  const initialValues = useMemo(
    () => ({
      email: sharedSupportCalculationByToken?.share?.email,
      role: buttons[0].value,
      password: '',
    }),
    [sharedSupportCalculationByToken?.share?.email],
  );

  const handleSubmitForm = useCallback(
    ({ email, role, password }) => {
      setLoading(true);

      const variables = {
        data: {
          email,
          password,
          accountType: role,
        },
      };

      handleSignUp(variables).finally(() => {
        localStorage.setItem(
          'sharedCalcId',
          sharedSupportCalculationByToken?.share?.supportCalculationId,
        );
      });
    },
    [handleSignUp, sharedSupportCalculationByToken?.share?.supportCalculationId],
  );

  const InviteDescription = useCallback(() => {
    if (sharedToken && !whoShare && !dataLoading) {
      return (
        <p className='text-muted mb-2'>
          This invitation is no longer available. Please contact the person who sent you the
          calculation. If you think this is an error, please contact technical support at
          <a href='mailto:help@divorcepath.com'> help@divorcepath.com</a>
        </p>
      );
    }

    return (
      <Fragment>
        <h6 className='h4 mb-0'>Shared with you</h6>

        <p className='text-muted mb-0 share-info'>
          {whoShare} shared a&nbsp;child and spousal support calculation with&nbsp;you. Create
          a&nbsp;free Divorcepath account to&nbsp;view the calculation.
        </p>
      </Fragment>
    );
  }, [dataLoading, sharedToken, whoShare]);

  return loading ? (
    <Loading page />
  ) : (
    <Fragment>
      <div className={classnames('text-center mb-2')}>
        <InviteDescription />
      </div>

      <Formik
        enableReinitialize
        validateOnBlur={false}
        validateOnChange={false}
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={handleSubmitForm}
      >
        {() => (
          <Form>
            <ToggleButtons
              className='d-flex flex-column align-items-center mt-4 auth-toggle'
              label='How will you use Divorcepath?'
              labelClassName='form-label headline'
              name='role'
              buttons={buttons}
            />

            <p className='text-muted text-center info-label'>
              Calculate support for myself or a friend - for free
            </p>

            <div className='separation-line my-4'>
              <SeparationLine />
            </div>

            <TextInput
              name='email'
              label='Email'
              placeholder='name@example.com'
              disabled={sharedToken && whoShare}
              size='md'
            />

            <TextInput
              type='password'
              label='Password'
              name='password'
              placeholder='Password'
              isRequired
            />

            <div className='row align-items-center mt-5'>
              <div className='col-sm-12'>
                <Button
                  size='lg'
                  type='submit'
                  name='login'
                  className='mb-3 mb-sm-0 w-100'
                  disabled={!checked || loading}
                >
                  Create account
                </Button>
              </div>
            </div>

            <Agreements checked={checked} setChecked={setChecked} />
          </Form>
        )}
      </Formik>
    </Fragment>
  );
};

export default ShareSignUp;
