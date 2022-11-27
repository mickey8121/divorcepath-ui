import React, { useCallback, useMemo } from 'react';

import { useMutation } from '@apollo/client';
import * as yup from 'yup';
import { Formik } from 'formik';
import { Form } from 'react-bootstrap';
import { toast } from 'react-toastify';

import TextInput from 'components/common/inputs/TextInput';
import CustomSelect from 'components/common/inputs/Select/SelectField';

import { orgRoles } from 'components/organization/members/InviteForm';

import useModal from 'hooks/useModal';

import professionalTypes, { professionalTypeValues } from 'utils/professionalTypes';

import UPDATE_ORGANIZATION_MEMBER from 'graphql/mutations/organization/member/updateOrganizationMember';

const inputs = [
  {
    name: `firstName`,
    placeholder: 'First Name',
  },
  {
    name: `lastName`,
    placeholder: 'Last Name',
  },
  {
    type: 'select',
    name: 'type',
    label: 'Professional type',
    options: professionalTypes,
    placeholder: 'Residence',
  },
  {
    type: 'select',
    name: 'role',
    label: 'Organization type',
    options: orgRoles,
    placeholder: 'Residence',
  },
];

const validationSchema = yup.object().shape({
  firstName: yup.string().max(20, 'Too Long!').required('First name is required'),
  lastName: yup.string().max(20, 'Too Long!').required('Last name is required'),
  type: yup.string().oneOf(professionalTypeValues).required("Who're you?"),
});

const EditMemberForm = ({ formId }) => {
  const [updateMember] = useMutation(UPDATE_ORGANIZATION_MEMBER);

  const { options, close, setLoading } = useModal('EDIT_MEMBER');

  const { member } = options || {};

  const initialValues = useMemo(
    () => ({
      firstName: member.user?.professional?.profile?.firstName,
      lastName: member.user?.professional?.profile?.lastName,
      type: member.user?.professional?.type,
      role: member?.role,
    }),
    [member],
  );

  const handleSubmitForm = useCallback(
    async ({ role, firstName, lastName, type }) => {
      setLoading(true);

      try {
        await updateMember({
          variables: {
            where: {
              id: member?.id,
            },
            data: {
              role,
              user: {
                update: {
                  professional: {
                    update: {
                      type,
                      profile: {
                        update: {
                          firstName,
                          lastName,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        });

        toast.success(`Member successfully updated`);
      } catch (error) {
        toast.error(error.message);
      }

      setLoading(false);
      close();
    },
    [member, updateMember, close, setLoading],
  );

  return (
    <Formik
      enableReinitialize
      validateOnBlur={false}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmitForm}
    >
      {({ handleSubmit }) => (
        <Form id={formId} onSubmit={handleSubmit} className='create-location-form'>
          {inputs.map(({ type, ...input }) => (
            <div key={input.name} className='location-col'>
              {type === 'select' ? (
                <CustomSelect className='mb-3' {...input} />
              ) : (
                <TextInput {...input} />
              )}
            </div>
          ))}
        </Form>
      )}
    </Formik>
  );
};

export default EditMemberForm;
