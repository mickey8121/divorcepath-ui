import React, { useMemo, useCallback } from 'react';

import * as yup from 'yup';
import { FormikProvider, useFormik } from 'formik';
import { Form } from 'reactstrap';
import { toast } from 'react-toastify';
import isEmpty from 'lodash/isEmpty';

import TextInput from 'components/common/inputs/TextInput';
import LocationPrompt from 'components/common/LocationPrompt';

import difference from 'components/calculations/utils/difference';

const validationSchema = yup.object().shape({
  first: yup.string().max(200, 'Too Long!').required("What's your first name?"),
  middle: yup.string().max(20, 'Too Long!'),
  last: yup.string().max(200, 'Too Long!').required("What's your last name?"),
});

const ChangeUsernameForm = ({ updateUser, initialValues }) => {
  const formInitialValues = useMemo(
    () => ({
      first: initialValues?.profile?.first,
      middle: initialValues?.profile?.middle,
      last: initialValues?.profile?.last,
    }),
    [initialValues],
  );

  const onSubmit = useCallback(
    values => {
      const differenceData = difference(values, formInitialValues);

      if (isEmpty(differenceData)) return null;

      const { first, middle, last } = values;

      const variables = {
        data: {
          profile: {
            update: {
              firstName: first,
              middleName: middle,
              lastName: last,
            },
          },
        },
        where: {
          id: initialValues.id,
        },
      };

      updateUser({ variables })
        .then(() => toast.success('Name has been successfully changed'))
        .catch(err => err.graphQLErrors.map(({ message }) => toast.error(message)));
    },
    [updateUser, initialValues, formInitialValues],
  );

  const formik = useFormik({
    initialValues: formInitialValues,
    enableReinitialize: true,
    onSubmit,
    validationSchema,
    validateOnBlur: true,
  });

  const { values, isValid } = formik;

  const handleBlur = useCallback(() => {
    if (!isValid) return null;

    onSubmit(values);
  }, [isValid, values, onSubmit]);

  return (
    <FormikProvider value={formik}>
      <LocationPrompt initialValues={formInitialValues} values={values} />
      <Form className='update-form username-form'>
        <div className='inputs-container'>
          <div className='left-side'>
            <h4 className='title'>Your Name</h4>
            <p className='subtitle'>Update your name using the form on the right.</p>
            <p className='subtitle'>* required for public profile</p>
          </div>
          <div className='right-side'>
            <TextInput
              size='md'
              name='first'
              placeholder='First Name'
              label='First name'
              onBlur={handleBlur}
              isRequired
            />
            <TextInput
              size='md'
              name='last'
              placeholder='Last Name'
              label='Last name'
              onBlur={handleBlur}
              isRequired
            />
            <TextInput
              size='md'
              name='middle'
              placeholder='Middle Name'
              containerClassName='mb-0'
              label='Middle name'
              onBlur={handleBlur}
            />
          </div>
        </div>
      </Form>
    </FormikProvider>
  );
};

export default ChangeUsernameForm;
