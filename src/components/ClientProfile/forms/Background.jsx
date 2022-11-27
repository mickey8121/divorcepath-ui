/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, useMemo, useCallback } from 'react';

import { Form, connect } from 'formik';
import dayjs from 'dayjs';
import { Row, Col, FormGroup, Label } from 'reactstrap';

import DayPickerInput from 'components/common/inputs/DayPickerInput';
import TextInput from 'components/common/inputs/TextInput';
import ToggleButtons from 'components/common/ToggleButtons';
import Button from 'components/common/Button';

const buttons = [
  {
    value: 'FEMALE',
    label: 'Female',
  },
  {
    value: 'MALE',
    label: 'Male',
  },
];

const newPartnerButtons = [
  {
    value: true,
    label: 'Yes',
  },
  {
    value: false,
    label: 'No',
  },
];

// formType
const Background = ({ loading, values, handleSubmit, errors = {}, formType, isRoleClient }) => {
  const [isFirstSubmit, setFirstSubmit] = useState(true);
  const isEx = formType === 'exBackground';

  const handleSubmitForm = useCallback(
    event => {
      event.preventDefault();

      setFirstSubmit(false);
      handleSubmit();
    },
    [handleSubmit],
  );

  const inputs = useMemo(
    () => [
      {
        name: 'firstName',
        label: 'First name',
        hint: `${
          isEx ? "Ex's" : isRoleClient ? 'Your' : "Your client's"
        } first name, as it appears on your ${
          isRoleClient ? (isEx ? "ex's" : '') : isEx ? "client's ex's" : "client's"
        } birth certificate. ${
          isRoleClient ? ' No short forms or nicknames at the courthouse!' : ''
        }`,
      },
      {
        name: 'middleName',
        label: 'Middle name(s)',
        hint: `Full middle name, if any. No initials, please 
      ${isRoleClient ? " - we'll need a full name for your legal documents" : ''}.`,
      },
    ],
    [isEx, isRoleClient],
  );

  const formDescription = useMemo(() => {
    if (isEx && !isRoleClient) return "your client's former partner (ex)";
    if (isEx && isRoleClient) return 'your former partner (ex)';
    return `${isRoleClient ? 'your background' : 'your client'}`;
  }, [isEx, isRoleClient]);

  const lastNameDescription = useMemo(() => {
    if (isEx)
      return (
        <small className='form-text text-muted mt-1'>
          Your
          {isRoleClient ? ' ' : " client's"}
          <span> ex&apos;s last name.</span>
        </small>
      );

    return (
      <small className='form-text text-muted mt-1'>
        Your
        {isRoleClient ? ' ' : " client's"}
        <span> last name. </span>
        {isRoleClient && (
          <span>
            If you&apos;re not sure whether to keep your married name, <a href='/'>read this</a>.
          </span>
        )}
      </small>
    );
  }, [isRoleClient, isEx]);

  const birthDate = useMemo(() => {
    if (values.birthDate)
      return (
        <p className='mt-3'>
          <span>
            {isRoleClient
              ? isEx
                ? 'Your ex is '
                : 'You are '
              : isEx
              ? "Your client's ex is "
              : 'Your client is '}
          </span>
          <strong>
            {dayjs().diff(values.birthDate, 'years')}
            <span> years</span>
          </strong>
          <span> old.</span>
        </p>
      );

    return <p className='mt-3'>Select a date of birth</p>;
  }, [isEx, isRoleClient, values]);

  const emailDescription = useMemo(() => {
    if (isEx)
      return (
        <small className='form-text text-muted mt-1'>
          We&apos;ll keep this on file for easy reference and use in your
          {isRoleClient ? '' : " client's "}
          <span> divorce documents.</span>
          {isRoleClient ? '' : ' We do not contact the parties directly.'}
        </small>
      );

    return (
      <small className='form-text text-muted mt-1'>
        {isRoleClient ? (
          <span>
            This is the main email address that we&apos;ll send notifications to. You can
            <a href='account-notifications.html'> manage your notifications</a>
          </span>
        ) : (
          "We'll keep this on file for easy reference. We do not contact your clients directly."
        )}
      </small>
    );
  }, [isEx, isRoleClient]);

  const phoneDescription = useMemo(() => {
    if (isEx)
      return (
        <span className='form-text text-muted mt-1'>
          We&apos;ll keep this on file for easy reference and use in your
          {isRoleClient ? ' ' : " client's "}
          divorce documents.
          {isRoleClient ? '' : ' We do not contact the parties directly.'}
        </span>
      );

    return (
      <span>
        {isRoleClient
          ? "We won't call unless it's really important, but we do need a number to be able to reach you if necessary."
          : "We'll keep this on file for easy reference. We do not contact your clients directly."}
      </span>
    );
  }, [isEx, isRoleClient]);

  const genderDescription = useMemo(() => {
    const client = isRoleClient ? '' : " client's";

    return `${
      isEx
        ? `Optional. Select your${client} ex's gender.`
        : `Optional. Select the gender indicated on your${client} birth certificate.`
    } ${
      isRoleClient
        ? "We'll use this to personalize support reports and to generate other documents."
        : ''
    }`;
  }, [isEx, isRoleClient]);

  return (
    <Form className='update-form-container' onSubmit={handleSubmitForm} name='form'>
      <div className='page-inner-header mb-4'>
        <h5 className='mb-1'>
          {isEx ? "Ex's " : isRoleClient ? '' : 'Client '}
          Background
        </h5>
        <p className='text-muted mb-0'>
          We&apos;ll need some basic information about
          <span> {formDescription} </span>
          in order to calculate support and generate legal documents.
        </p>
      </div>
      <Row className='align-items-start'>
        {inputs.map(({ name, label, hint }) => (
          <Col md={6} key={name}>
            <TextInput name={name} label={label} hint={hint} />
          </Col>
        ))}
      </Row>

      <Row className='align-items-start'>
        <Col md={6}>
          <TextInput name='lastName' label='Last name' hintComponent={lastNameDescription} />
        </Col>

        <Col md={6}>
          <ToggleButtons label='Gender' name='gender' buttons={buttons} hint={genderDescription} />
        </Col>
      </Row>
      <Row className='align-items-start'>
        <Col md={6}>
          <DayPickerInput
            name='birthDate'
            label='Date of Birth'
            hint={`Enter your ${isRoleClient ? '' : " client's"}${
              isEx ? " ex's" : ''
            } date of birth`}
            touchable
          />
        </Col>
        <Col md={6}>
          <FormGroup className='computed-date'>
            <Label className='form-control-label'>Age</Label>
            {birthDate}
            <small className='form-text text-muted mt-1'>
              Edit your
              {isRoleClient ? '' : " client's"}
              {isEx ? " ex's" : ''}
              <span> date of birth if this is wrong.</span>
            </small>
          </FormGroup>
        </Col>
      </Row>
      <Row className='align-items-start'>
        {!isRoleClient && (
          <Col md={6}>
            <TextInput name='email' label='Email' hintComponent={emailDescription} />
          </Col>
        )}
        {!isRoleClient && (
          <Col md={6}>
            <TextInput name='phone' label='Phone' hint={phoneDescription} />
          </Col>
        )}
      </Row>
      <Row className='align-items-start'>
        <Col md={6}>
          <ToggleButtons
            label='New Partner?'
            name='hasNewPartner'
            buttons={newPartnerButtons}
            hint='Remarried or new common law-partner? This can affect tax calculations.'
          />
        </Col>
      </Row>
      <Button
        type='submit'
        className='mt-3'
        size='lg'
        leftFAIcon='check'
        disabled={loading || (Object.keys(errors).length !== 0 && !isFirstSubmit)}
      >
        Save & Continue
      </Button>
    </Form>
  );
};

export default connect(Background);
