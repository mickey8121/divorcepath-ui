import React from 'react';

import { Row, Col, Collapse, Form } from 'reactstrap';

import TextInput from 'components/common/inputs/TextInput';
import Button from 'components/common/Button';
import TextAreaComponent from 'components/common/inputs/TextAreaInput';

const NewClientForm = ({ isOpen, onSubmit, loading, formTitle }) => (
  <Collapse isOpen={isOpen}>
    <div className='shadow-hover mb-4 mb-3 px-3'>
      <div className='actions-toolbar py-2'>
        <h5 className='mb-1'>{formTitle}</h5>
      </div>
      <Form onSubmit={onSubmit} className='row align-items-start add-client-form'>
        <Col className='d-flex flex-column'>
          <Row>
            <Col sm={12} md={4}>
              <TextInput name='firstName' placeholder='First name' disabled={loading} />
            </Col>
            <Col sm={12} md={4}>
              <TextInput name='middleName' placeholder='Middle name' disabled={loading} />
            </Col>
            <Col sm={12} md={4}>
              <TextInput name='lastName' placeholder='Last name' disabled={loading} />
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={6}>
              <TextInput name='phone' placeholder='Phone number (optional)' disabled={loading} />
            </Col>
            <Col sm={12} md={6}>
              <TextInput name='email' placeholder='Email (optional)' disabled={loading} />
            </Col>
          </Row>
          <Row>
            <Col>
              <TextAreaComponent
                name='legalIssue'
                placeholder='Client inquiry (optional)'
                disabled={loading}
              />
            </Col>
          </Row>
          <Row className='mb-3'>
            <Col>
              <TextAreaComponent
                name='notes'
                placeholder='Intake notes (optional)'
                disabled={loading}
              />
            </Col>
          </Row>
          <Button className='new-client-btn align-self-sm-end' type='submit' loading={loading}>
            Save Client
          </Button>
        </Col>
      </Form>
    </div>
  </Collapse>
);

export default NewClientForm;
