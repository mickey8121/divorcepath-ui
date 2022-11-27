/* eslint-disable react/no-array-index-key */
import React, { useCallback, useMemo } from 'react';

import { FormikProvider, useFormik } from 'formik';
import { Form } from 'reactstrap';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import isEmpty from 'lodash/isEmpty';

import SelectInput from 'components/common/inputs/Select/SelectField';
import LocationPrompt from 'components/common/LocationPrompt';
import TextArea from 'components/common/inputs/TextAreaInput';

import AssistantSelect, {
  formatAssistantOption,
} from 'components/ProProfile/forms/AssistantSelect';
import difference from 'components/calculations/utils/difference';

import useCurrentUser from 'hooks/useCurrentUser';

import professionalTypes from 'utils/professionalTypes';

import UPDATE_PROFESSIONAL from 'graphql/mutations/professional/updateProfessional';

const BackgroundForm = () => {
  const { me } = useCurrentUser();
  const [updateProfessional] = useMutation(UPDATE_PROFESSIONAL);

  const initialValues = useMemo(
    () => ({
      biography: me.professional?.biography || '',
      type: me.professional?.type,
      assistants:
        me.professional.assistants?.map(assistant => ({
          key: assistant.id,
          label: formatAssistantOption(assistant),
          value: assistant.id,
        })) || [],
    }),
    [me],
  );

  const onSubmit = useCallback(
    values => {
      const differenceData = difference(values, initialValues);

      if (isEmpty(differenceData)) return null;

      const variables = {
        data: {
          type: values.type,
          biography: values.biography,
          assistants: {
            set: values.assistants?.length
              ? values.assistants?.map(({ value }) => ({
                  id: value,
                }))
              : [],
          },
        },
        where: {
          id: me.professional?.id,
        },
      };

      updateProfessional({ variables })
        .then(() => toast.success('Background info has been successfully changed'))
        .catch(err => err.graphQLErrors.map(({ message }) => toast.error(message)));
    },
    [me.professional, updateProfessional, initialValues],
  );

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit,
  });

  const { values, handleSubmit } = formik;

  return (
    <FormikProvider value={formik}>
      <LocationPrompt initialValues={initialValues} values={values} />
      <Form className='update-form username-form'>
        <div className='inputs-container'>
          <div className='left-side'>
            <h4 className='title'>Professional Background</h4>
            <p className='subtitle'>
              Complete your professional profile using the form on the right.
            </p>
            <p className='subtitle'>* required for public profile</p>
          </div>
          <div className='right-side'>
            <SelectInput
              name='type'
              label='Professional type'
              placeholder='Select your professional type'
              containerClassName='mb-3'
              size='md'
              isRequired
              onBlur={handleSubmit}
              options={professionalTypes}
            />

            <TextArea
              type='textarea'
              name='biography'
              label='Biography'
              placeholder='Edit your biography...'
              onBlur={handleSubmit}
              isRequired
            />

            <AssistantSelect onBlur={handleSubmit} />
          </div>
        </div>
      </Form>
    </FormikProvider>
  );
};

export default BackgroundForm;
