import React, { useCallback, useMemo } from 'react';

import { FormikProvider, useFormik } from 'formik';
import { Form } from 'reactstrap';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';

import TextInput from 'components/common/inputs/TextInput';
import TextArea from 'components/common/inputs/TextAreaInput';

import useModal from 'hooks/useModal';

import UPDATE_CLIENT from 'graphql/mutations/clients/updateClient';

const inputs = [
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'name@example.com',
  },
  {
    name: 'phone',
    label: 'Phone number',
    placeholder: '+1 (123) - 456 - 7890 ',
  },
  {
    name: 'issue',
    type: 'textarea',
    label: 'Client inquiry',
  },
  {
    name: 'notes',
    type: 'textarea',
    label: 'Intake notes ',
  },
];

const UpdateIntakeForm = ({ formId }) => {
  const { options, close } = useModal('UPDATE_INTAKE');

  const initialIntake = useMemo(() => options?.client?.intakeForm, [options]);
  const client = useMemo(() => options?.client, [options]);

  const initialValues = useMemo(
    () => ({
      email: initialIntake?.email || '',
      phone: initialIntake?.phone || '',
      notes: initialIntake?.notes || '',
      issue: initialIntake?.issue || '',
    }),
    [initialIntake],
  );

  const [updateClient] = useMutation(UPDATE_CLIENT);

  const onSubmit = useCallback(
    async ({ email, phone, issue, notes }) => {
      const formData = {
        email,
        phone,
        issue,
        notes,
        firstName: client?.profile?.firstName || ' ',
        lastName: client?.profile?.lastName || ' ',
      };

      const variables = {
        data: {
          intakeForm: {
            upsert: {
              update: formData,
              create: formData,
            },
          },
        },
        where: { id: client?.id },
      };

      if (!client?.profile?.email) {
        variables.data.profile = {
          update: {
            email,
          },
        };
      }

      try {
        await toast.promise(updateClient({ variables }), {
          pending: `Updating client intake...`,
          success: `Client intake updated`,
          error: `Client intake not updated`,
        });

        close();
      } catch {}
    },
    [updateClient, client, close],
  );

  const formik = useFormik({
    initialValues,
    onSubmit,
    validateOnBlur: false,
    enableReinitialize: true,
  });

  const { handleSubmit } = formik;

  return (
    <FormikProvider value={formik}>
      <Form id={formId} onSubmit={handleSubmit} className='update-intake-form'>
        {inputs.map(input => (
          <div key={input.name} className='intake-form-input'>
            {input.type === 'textarea' ? <TextArea {...input} /> : <TextInput {...input} />}
          </div>
        ))}
      </Form>
    </FormikProvider>
  );
};

export default UpdateIntakeForm;
