import React, { useState, useCallback } from 'react';

import { Form } from 'formik';
import { Col, Row } from 'reactstrap';

import TextInput from 'components/common/inputs/TextInput';
import SelectInput from 'components/common/inputs/Select/SelectField';
import Button from 'components/common/Button';

const Address = ({
  loading,
  handleSubmit,
  errors = {},
  formType,
  description,
  inputs,
  isRoleClient,
}) => {
  const [isFirstSubmit, setFirstSubmit] = useState(true);

  const handleSubmitForm = useCallback(
    event => {
      event.preventDefault();

      setFirstSubmit(false);
      handleSubmit();
    },
    [handleSubmit],
  );

  return (
    <Form className='update-form-container' onSubmit={handleSubmitForm} name='form'>
      <div className='page-inner-header mb-4'>
        <h5 className='mb-1'>
          {formType === 'address' ? '' : "Ex's "}
          Address
        </h5>
        {isRoleClient && (
          <p className='text-muted mb-2'>
            Address information is <b>optional</b> and may be provided to customize your report.
          </p>
        )}
        <p className='text-muted mb-0'>{description}</p>
      </div>
      <Row>
        <Col>
          <TextInput
            name='street1'
            label='Street Address'
            placeholder={`Optional. Enter ${formType === 'exAddress' ? "Ex's " : ''}street address`}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <TextInput
            name='street2'
            label='Address Line 2'
            placeholder='Optional. Second line of street address'
          />
        </Col>
      </Row>
      <Row>
        {inputs.map(({ type, placeholder, label, name, options }) => (
          <Col md={6} key={name}>
            {type === 'select' ? (
              <SelectInput name={name} label={label} placeholder={placeholder} options={options} />
            ) : (
              <TextInput name={name} type={type} label={label} placeholder={placeholder} />
            )}
          </Col>
        ))}
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

export default Address;
