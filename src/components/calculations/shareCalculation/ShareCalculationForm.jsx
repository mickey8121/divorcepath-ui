import React, { useMemo, useCallback, useState, useEffect } from 'react';

import { FormikProvider, useFormik, Form } from 'formik';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import { uniqueId } from 'lodash/util';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';

import TextInput from 'components/common/inputs/TextInput';
import Button from 'components/common/Button';

import { uniqueEmail as uniqueEmailValidation } from 'components/calculations/utils/validationSchema';
import ShareCalculationList from 'components/calculations/shareCalculation/ShareCalculationList';

import useCurrentUser from 'hooks/useCurrentUser';

import CHANGE_SHARE_SUPPORT_CALCULATION from 'graphql/mutations/calculations/changeShareSupportCalculation';

const ShareCalculationForm = ({ calculationId, sharedWith, isClientsList, loading }) => {
  const { me } = useCurrentUser();

  const [changeShareSupportCalculation, { loading: updateLoading }] = useMutation(
    CHANGE_SHARE_SUPPORT_CALCULATION,
  );

  const [currentEmails, setCurrentEmails] = useState(sharedWith || []);

  useEffect(() => setCurrentEmails(sharedWith || []), [sharedWith]);

  const onSubmit = useCallback(
    ({ email }, { resetForm }) => {
      if (email === me?.email) {
        return toast.error("You can't share calculation to yourself");
      }

      setCurrentEmails(prev => {
        return [...prev, { email, status: 'ACTIVE', id: uniqueId() }];
      });

      changeShareSupportCalculation({
        variables: {
          data: {
            email,
            supportCalculationId: calculationId,
          },
        },
      }).then(() => {
        toast.success(`Calculation sended on email ${email}`);
        resetForm();
      });
    },
    [calculationId, changeShareSupportCalculation, me],
  );

  const initialEmails = useMemo(() => {
    if (!loading) {
      return currentEmails?.filter(({ status }) => status === 'ACTIVE').map(({ email }) => email);
    }
  }, [loading, currentEmails]);

  const formik = useFormik({
    validationSchema: yup.object().shape({ email: uniqueEmailValidation }),
    initialValues: { emails: initialEmails },
    onSubmit,
    validateOnBlur: false,
    validateOnChange: true,
    enableReinitialize: true,
  });

  const {
    values: { emails },
    handleSubmit,
    handleChange,
  } = formik;

  const removeHandler = (arrayHelper, email) => {
    const listIndexEmail = currentEmails.findIndex(currentEmail => currentEmail === email);
    arrayHelper.remove(currentEmails, listIndexEmail);

    setCurrentEmails(currentEmails.filter(item => item.email !== email));

    changeShareSupportCalculation({
      variables: {
        data: {
          email,
          supportCalculationId: calculationId,
        },
      },
    }).then(toast.success(`Sharing with ${email} cancelled`));
  };

  return (
    <div className='calculator-section-container '>
      <div className='result-section share-calculation'>
        <Row className='no-gutters share-calculation-row' id='#share-calculation'>
          <Col md={12} className='align-items-justify'>
            {!isClientsList && <h5 className='title'>Share Calculation</h5>}

            {!isClientsList && (
              <p className='text-muted'>
                Your calculations are private, but you can share them securely through Divorcepath
                if you choose.
              </p>
            )}

            <FormikProvider value={formik}>
              <Form onSubmit={handleSubmit} noValidate className='share-calculation-form'>
                <Row className='no-gutters justify-content-between'>
                  <Col lg={6} md={12}>
                    <Row className='no-gutters form-row w-100'>
                      <TextInput
                        id='email'
                        name='email'
                        type='email'
                        size='md'
                        label={isClientsList && 'Share by Email'}
                        placeholder='example@example.com'
                        className='form-control-md'
                        handleChange={handleChange}
                      />

                      <Button
                        id='share-button'
                        type='submit'
                        className='share-button'
                        size='md'
                        rightIcon='share'
                        disabled={!me?.id || updateLoading}
                      >
                        Share
                      </Button>
                    </Row>

                    <div className='description'>
                      <p className='text-muted'>
                        Clicking “share” will send an&nbsp;e-mail to&nbsp;the person at&nbsp;this
                        address, inviting them to&nbsp;view this calculation in&nbsp;Divorcepath.
                      </p>

                      <p className='text-muted'>
                        They can click the link in&nbsp;the email to&nbsp;create an&nbsp;account
                        or&nbsp;log in&nbsp;to&nbsp;existing account. They will not be&nbsp;able
                        to&nbsp;edit or&nbsp;change the calculation.
                      </p>

                      {!me?.id && (
                        <Link to='/sign-in'>
                          Create a free account to securely share your calculations through
                          Divorcepath
                        </Link>
                      )}
                    </div>
                  </Col>

                  <Col lg={5} md={12} className='shared-with'>
                    <h5 className='title mb-3'>Shared With:</h5>

                    <Row className='no-gutters shared-with-header'>
                      <Col md={6} xs={6} className='d-flex justify-content-start'>
                        <small className='text-muted'>Email</small>
                      </Col>

                      <Col md={6} xs={6} className='d-flex justify-content-end'>
                        <small className='text-muted'>Action</small>
                      </Col>
                    </Row>

                    <Row className='no-gutters d-flex'>
                      <ShareCalculationList
                        emails={emails}
                        loading={loading}
                        updateLoading={updateLoading}
                        removeHandler={removeHandler}
                      />
                    </Row>
                  </Col>
                </Row>
              </Form>
            </FormikProvider>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ShareCalculationForm;
