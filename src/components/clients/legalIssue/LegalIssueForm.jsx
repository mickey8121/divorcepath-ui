import React, { useCallback, useEffect, useRef } from 'react';

import { FormikProvider, useFormik, Form } from 'formik';

import TextInput from 'components/common/inputs/TextInput';
import TextAreaInput from 'components/common/inputs/TextAreaInput';

const LegalIssueForm = ({ formId, onSubmitClick, name, description, id }) => {
  const ref = useRef();

  const onSubmit = useCallback(values => onSubmitClick(values, id), [id, onSubmitClick]);

  const formik = useFormik({
    initialValues: { name, description },
    onSubmit,
  });

  const { handleSubmit } = formik;

  useEffect(() => {
    if (ref.current) ref.current.focus();
  }, []);

  return (
    <FormikProvider value={formik}>
      <Form id={formId} onSubmit={handleSubmit}>
        <TextInput type='text' name='name' label='Title' placeholder='Title of legal issue' />
        <TextAreaInput
          name='description'
          label='Description (optional)'
          placeholder='Description of legal issues'
          ref={ref}
        />
      </Form>
    </FormikProvider>
  );
};

export default LegalIssueForm;
