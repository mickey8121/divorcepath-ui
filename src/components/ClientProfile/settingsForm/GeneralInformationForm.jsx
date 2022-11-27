import React, { useCallback, useMemo } from 'react';

import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useFormik, FormikProvider } from 'formik';
import { Form } from 'reactstrap';
import isEmpty from 'lodash/isEmpty';

import TextInput from 'components/common/inputs/TextInput';
import LocationPrompt from 'components/common/LocationPrompt';

import difference from 'components/calculations/utils/difference';

import useCurrentUser from 'hooks/useCurrentUser';

const validationSchema = yup.object().shape({
  emailAddress: yup.string().email().required('Need an email address here.'),
  phone: yup.string(),
});

const GeneralInformationForm = ({ updateUser, initialValues }) => {
  const { isPro } = useCurrentUser();

  const formInitialValues = useMemo(
    () => ({
      emailAddress: initialValues?.email,
      phone: initialValues.profile.phone,
    }),
    [initialValues],
  );

  const onSubmit = useCallback(
    values => {
      const differenceData = difference(values, formInitialValues);

      if (isEmpty(differenceData)) return null;

      const { emailAddress, phone } = values;

      const variables = {
        data: {
          profile: {
            update: {
              email: emailAddress || null,
              phone: phone || null,
            },
          },
        },
        where: {
          id: initialValues.id,
        },
      };

      updateUser({ variables })
        .then(() => toast.success('Contact information has been successfully changed'))
        .catch(err => err.graphQLErrors.map(({ message }) => toast.error(message)));
    },
    [updateUser, initialValues, formInitialValues],
  );

  const formik = useFormik({
    initialValues: formInitialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit,
  });

  const { values, handleSubmit } = formik;

  return (
    <FormikProvider value={formik}>
      <LocationPrompt initialValues={formInitialValues} values={values} />
      <Form className='update-form username-form'>
        <div className='inputs-container'>
          <div className='left-side'>
            <h5 className='title'>Contact Information</h5>
            <p className='subtitle'>Update your contact information using the form on the right.</p>
            {isPro && <p className='subtitle'>* required for public profile</p>}
          </div>
          <div className='right-side'>
            <TextInput
              size='md'
              name='emailAddress'
              label='Email'
              placeholder='email@example.com'
              isRequired={isPro}
              onBlur={handleSubmit}
              disabled
              hintComponent={
                <small className='form-text text-muted mt-1'>
                  Contact{' '}
                  <a
                    href='http://www.diworcepath.com/help'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Divorcepath Help
                  </a>{' '}
                  to change email address
                </small>
              }
            />

            <TextInput
              size='md'
              name='phone'
              label='Phone'
              containerClassName='mb-0'
              placeholder='+1 250 555 0199'
              onBlur={handleSubmit}
              isRequired={isPro}
            />
          </div>
        </div>
      </Form>
    </FormikProvider>
  );
};

export default GeneralInformationForm;
