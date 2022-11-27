import React, { useMemo, useCallback, Fragment } from 'react';

import { Formik, Form, yupToFormErrors } from 'formik';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { Row, Col, FormGroup, Label } from 'reactstrap';

import DayPickerInput from 'components/common/inputs/DayPickerInput';
import ToggleButtons from 'components/common/ToggleButtons';
import Button from 'components/common/Button';
import LocationPrompt from 'components/common/LocationPrompt';

import scrollToError from 'components/calculations/sidebar/scrollToError';

import customGet from 'utils/get';
import { relationshipSchema } from 'utils/schemas';

const buttons = [
  {
    label: 'Legally Married?',
    type: 'isMarried',
    buttons: [
      {
        value: true,
        label: 'Married',
      },
      {
        value: false,
        label: 'Common Law',
      },
    ],
  },
  {
    label: 'Separated?',
    type: 'isSeparated',
    buttons: [
      {
        value: true,
        label: 'Separated',
      },
      {
        value: false,
        label: 'Cohabiting',
      },
    ],
  },
];

const toggleButtons = [
  {
    value: true,
    label: 'Yes',
  },
  {
    value: false,
    label: 'No',
  },
];

const ProfileRelationship = ({ user, updateUser, isRoleClient }) => {
  const relationship = useMemo(() => customGet(user, 'client.relationship', {}), [user]);
  const initialValues = useMemo(
    () => ({
      relationship: {
        cohabitationDate: relationship?.cohabitationDate
          ? new Date(relationship?.cohabitationDate)
          : null,
        separationDate: relationship?.separationDate
          ? new Date(relationship?.separationDate)
          : null,
        marriageDate: relationship?.marriageDate ? new Date(relationship?.marriageDate) : null,
        divorceDate: relationship?.divorceDate ? new Date(relationship?.divorceDate) : null,
        isMarried: relationship?.isMarried,
        isSeparated: relationship?.isSeparated,
        isDivorced: relationship?.isDivorced,
      },
    }),
    [relationship],
  );

  const handleSubmitForm = useCallback(
    values => {
      const data = {
        ...values.relationship,
        marriageDate: values.relationship.marriageDate || null,
      };

      const variables = {
        data: {
          relationship: {
            upsert: {
              update: data,
              create: data,
            },
          },
        },
        where: {
          id: user.client.id,
        },
      };

      updateUser(variables);
    },
    [updateUser, user],
  );

  const description = useMemo(() => {
    if (isRoleClient)
      return "We'll need to know when your relationship started and when it ended, as well as your marital status.";

    return "Enter your client's relationship and marital status below. These dates will be used to calculate support.";
  }, [isRoleClient]);

  const validateForm = useCallback(
    values =>
      relationshipSchema
        .validate(values, { abortEarly: false, context: { isClient: isRoleClient } })
        .then(() => {})
        .catch(err => {
          setTimeout(() => scrollToError(), 0);
          return yupToFormErrors(err);
        }),
    [isRoleClient],
  );

  return (
    <Formik
      validateOnBlur={false}
      enableReinitialize
      initialValues={initialValues}
      validate={validateForm}
      onSubmit={handleSubmitForm}
    >
      {({ values, errors = {}, handleSubmit, setFieldValue, setFieldTouched }) => {
        const handleMarriageDateChange = date => {
          const selectedDate = date?.target?.value || date;

          const formattedDate = dayjs(selectedDate);

          setFieldValue('relationship.marriageDate', formattedDate);
          setFieldTouched('relationship.marriageDate', true);

          if (!values?.relationship?.cohabitationDate) {
            setFieldValue('relationship.cohabitationDate', formattedDate);
            setFieldTouched('relationship.cohabitationDate', true);
          }
        };

        return (
          <Fragment>
            <LocationPrompt initialValues={initialValues} values={values} />
            <Form name='form' className='update-form-container' onSubmit={handleSubmit}>
              <div className='page-inner-header mb-4'>
                <h5 className='mb-1'>The Relationship</h5>
                <p className='text-muted mb-0'>{description}</p>
              </div>
              <Row className='align-items-start'>
                <Col md={6}>
                  <DayPickerInput
                    name='relationship.cohabitationDate'
                    label='Date of Cohabitation'
                    hint={`Enter the date ${
                      isRoleClient ? 'you' : 'your client'
                    } began cohabiting (may be the same as marriage date)`}
                    touchable
                  />
                </Col>
                <Col md={6}>
                  <DayPickerInput
                    disabled={!customGet(values, 'relationship.isMarried')}
                    name='relationship.marriageDate'
                    label='Date of Marriage'
                    onBlur={handleMarriageDateChange}
                    onCalendarClose={handleMarriageDateChange}
                    hint={`Enter the date ${
                      isRoleClient ? 'you were' : 'your client was'
                    }  legally married (leave blank if not married).`}
                    touchable
                  />
                </Col>
              </Row>
              <Row className='align-items-start'>
                <Col md={6}>
                  <DayPickerInput
                    name='relationship.separationDate'
                    label='Date of Separation'
                    hintComponent={
                      <small className='form-text text-muted mt-1'>
                        Enter the date
                        {isRoleClient ? ' you separated.' : ' of separation.'}
                        {isRoleClient && (
                          <Fragment>
                            <span>If you&apos;re not sure,</span>
                            <Link to='/'> read how to determine your separation date.</Link>
                          </Fragment>
                        )}
                      </small>
                    }
                    touchable
                  />
                </Col>
                <Col md={6}>
                  <FormGroup className='computed-date'>
                    <Label className='form-control-label'>Length of Relationship</Label>
                    {values.relationship ? (
                      <p className='mt-3'>
                        {isRoleClient ? 'Your ' : 'Your client`s '}
                        <span>relationship lasted for </span>
                        <strong>
                          {dayjs(values?.relationship?.separationDate).diff(
                            values?.relationship?.cohabitationDate,
                            'years',
                          ) || 0}
                        </strong>
                        <span> years</span>
                      </p>
                    ) : (
                      <p className='mt-3'>Select a cohabitation and separation dates</p>
                    )}
                    <small className='form-text text-muted mt-1'>
                      Check the cohabitation and separation dates if this is wrong. The length of
                      relationship is a factor in spousal support calculations, and can affect the
                      amount of support calculated as payable.
                    </small>
                  </FormGroup>
                </Col>
              </Row>
              <Row className='align-items-start'>
                {buttons.map(button => (
                  <Col md={6} key={button.type}>
                    <ToggleButtons
                      label={button.label}
                      name={`relationship.${button.type}`}
                      buttons={button.buttons}
                    />
                  </Col>
                ))}
              </Row>
              <Row className='align-items-start'>
                <Col md={6}>
                  <ToggleButtons
                    label='Divorced?'
                    name='relationship.isDivorced'
                    buttons={toggleButtons}
                    hint='Has a divorce been granted?'
                  />
                </Col>
                <Col md={6}>
                  {customGet(values, 'relationship.isDivorced') && (
                    <DayPickerInput
                      name='relationship.divorceDate'
                      label='Date of Divorce'
                      hint='Date of divorce judgment'
                      touchable
                    />
                  )}
                </Col>
              </Row>

              <Button
                type='submit'
                size='lg'
                className='mt-3'
                leftFAIcon='check'
                disabled={Object.keys(errors).length !== 0}
              >
                Save & Continue
              </Button>
            </Form>
          </Fragment>
        );
      }}
    </Formik>
  );
};

export default ProfileRelationship;
