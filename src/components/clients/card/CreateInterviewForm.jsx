import React, { useCallback, useMemo, useState } from 'react';

import { FormikProvider, useFormik } from 'formik';
import { Form } from 'reactstrap';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import TextInput from 'components/common/inputs/TextInput';
import CustomSelect from 'components/common/inputs/Select/SelectField';

import useModal from 'hooks/useModal';

import CLIENT_FRAGMENT from 'graphql/fragments/client';
import CREATE_INTERVIEW from 'graphql/mutations/interview/createInterview';
import UPDATE_CLIENT from 'graphql/mutations/clients/updateClient';

const interviewTypes = [
  { label: 'Long', value: false },
  { label: 'Short', value: true },
];

const validationSchema = yup.object().shape({
  email: yup.string().email('Please enter correct email').required('Email is required'),
});

const CreateInterviewForm = ({ formId }) => {
  const [isAskStory, setIsAskStory] = useState(true);

  const { options, close } = useModal('CREATE_INTERVIEW');

  const client = useMemo(() => options?.client, [options]);

  const [createInterview] = useMutation(CREATE_INTERVIEW);
  const [updateClient] = useMutation(UPDATE_CLIENT);

  const initialValues = useMemo(
    () => ({
      email: client?.profile?.email,
      askStory: false,
      shortInterview: false,
    }),
    [client],
  );

  const onSubmit = useCallback(
    async ({ email, shortInterview }) => {
      const variables = {
        data: {
          clientId: client?.id,
          clientEmail: email,
          shortInterview,
          askStory: isAskStory,
        },
      };

      try {
        const toastId = toast.loading('Creating intake interview...');

        if (!client?.profile?.email) {
          await updateClient({
            variables: {
              where: {
                id: client?.id,
              },
              data: {
                profile: {
                  update: {
                    email,
                  },
                },
              },
            },
          });
        }

        await createInterview({
          variables,
          update: (cache, { data }) => {
            let cacheClient;

            try {
              cacheClient = cache.readFragment({
                id: `Client:${client?.id}`,
                fragment: CLIENT_FRAGMENT,
                fragmentName: 'CLIENT_FRAGMENT',
              });
            } catch (error) {}

            if (cacheClient) {
              cache.writeFragment({
                id: `Client:${client?.id}`,
                fragment: CLIENT_FRAGMENT,
                fragmentName: 'CLIENT_FRAGMENT',
                data: {
                  ...client,
                  interviews: [...client?.interviews, data?.createIntakeInterview?.interview],
                },
              });
            }
          },
        });

        toast.dismiss(toastId);
        toast.success('Intake interview created');
      } catch {
        toast.dismiss();
        toast.error('Intake interviews can be created once every 15 minutes. Try again later');
      } finally {
        close();
      }
    },
    [isAskStory, client, createInterview, close, updateClient],
  );

  const handleChangeToggle = useCallback(() => setIsAskStory(prev => !prev), []);

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
    validateOnBlur: false,
    enableReinitialize: true,
  });

  const { handleSubmit } = formik;

  return (
    <FormikProvider value={formik}>
      <Form id={formId} onSubmit={handleSubmit} className='create-interview-form'>
        <TextInput name='email' label='Client email' placeholder='name@example.com' />
        <CustomSelect
          options={interviewTypes}
          defaultValue={interviewTypes[0]}
          name='shortInterview'
          label='Interview type'
        />
        <div className='custom-control custom-checkbox'>
          <input
            className='custom-control-input'
            name='askStory'
            id='customCheckRegister'
            onChange={handleChangeToggle}
            type='checkbox'
            checked={isAskStory}
          />
          <label className='custom-control-label' htmlFor='customCheckRegister'>
            <span>Ask client to describe legal issues and situation?</span>
          </label>
        </div>
      </Form>
    </FormikProvider>
  );
};

export default CreateInterviewForm;
