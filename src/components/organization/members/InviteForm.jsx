import React, { useCallback } from 'react';

import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { Formik } from 'formik';

import TextInput from 'components/common/inputs/TextInput';
import CustomSelect from 'components/common/inputs/Select/SelectField';

import useCurrentUser from 'hooks/useCurrentUser';
import useModal from 'hooks/useModal';

import professionalTypes from 'utils/professionalTypes';

import INVITE_ORGANIZATION_MEMBER from 'graphql/mutations/organization/member/inviteOrganizationMember';
import ORGANIZATION_INVITES from 'graphql/queries/organization/organizationInvites';

const initialValues = { email: '', professionalType: 'LAWYER', role: 'USER' };
const validationSchema = yup.object().shape({
  email: yup.string().email().required(),
});

export const orgRoles = [
  { label: 'Admin', value: 'ADMIN' },
  { label: 'User', value: 'USER' },
];

const InviteForm = ({ formId }) => {
  const { close } = useModal('INVITE_MEMBER');

  const { isFreeSub, isOrgAdmin } = useCurrentUser();
  const [inviteOrganizationMember] = useMutation(INVITE_ORGANIZATION_MEMBER);

  const handleSubmitForm = useCallback(
    async (values, { resetForm }) => {
      const variables = { data: values };

      try {
        await inviteOrganizationMember({
          variables,
          update: (proxy, { data }) => {
            const invites = proxy.readQuery({
              query: ORGANIZATION_INVITES,
              variables: { where: { status: { equals: 'PENDING' } } },
            });

            proxy.writeQuery({
              query: ORGANIZATION_INVITES,
              variables: { where: { status: { equals: 'PENDING' } } },
              data: {
                organizationInvites: [
                  ...(invites?.organizationInvites || []),
                  data?.inviteOrganizationMember?.organizationInvite,
                ],
              },
            });
          },
        });
        resetForm();
        const dataLayer = window.dataLayer || [];
        dataLayer.push({ ecommerce: null });
        dataLayer.push({
          event: 'send_pro_invite',
          traffic_type:
            window.location.hostname === 'www.divorcepath.com' ? 'external' : 'internal',
          method: 'email',
        });
        close();
        toast.success(`The invitation was successfully sent to ${values.email}.`);
      } catch (err) {
        toast.error(err.message);
      }
    },
    [inviteOrganizationMember, close],
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmitForm}
    >
      {({ handleSubmit }) => (
        <form id={formId} onSubmit={handleSubmit}>
          <TextInput
            size='md'
            disabled={isFreeSub && !isOrgAdmin}
            name='email'
            label='Email'
            placeholder='Email'
          />

          <CustomSelect
            size='md'
            containerClassName='mb-3'
            label='Role in the organization'
            name='role'
            options={orgRoles}
          />
          <CustomSelect
            size='md'
            label='Professional type'
            name='professionalType'
            options={professionalTypes}
          />
        </form>
      )}
    </Formik>
  );
};
export default InviteForm;
