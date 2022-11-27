import React, { useState, useCallback, useMemo } from 'react';

import { useMutation } from '@apollo/client';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';
import { Card, CardBody } from 'reactstrap';
import { toast } from 'react-toastify';
import classNames from 'classnames';

import AuthPage from 'layout/AuthPage';

import Button from 'components/common/Button';
import CustomSelect from 'components/common/inputs/Select/SelectField';
import TextInput from 'components/common/inputs/TextInput';

import useCurrentUser from 'hooks/useCurrentUser';
import useCreateOrganization from 'hooks/useCreateOrganization';

import professionalTypes, { professionalTypeValues } from 'utils/professionalTypes';
import organizationTypes from 'utils/organizationTypes';

import UPDATE_CLIENT from 'graphql/mutations/clients/updateClient';
import UPDATE_PROFESSIONAL from 'graphql/mutations/professional/updateProfessional';

const inputs = [
  {
    type: 'text',
    label: 'First Name',
    name: 'firstName',
    placeholder: 'First Name',
  },
  {
    type: 'text',
    label: 'Last Name',
    name: 'lastName',
    placeholder: 'Last Name',
  },
];

const initialValues = {
  firstName: '',
  last: '',
  type: professionalTypeValues[0],
  orgType: 'LAW_FIRM',
};

const schema = (isPro, isOrgMember) => {
  const rules = {
    firstName: yup.string().max(20, 'Too Long!').required("What's your first name?"),
    lastName: yup.string().max(20, 'Too Long!').required("What's your last name?"),
  };

  if (isPro && !isOrgMember)
    return yup.object().shape({
      ...rules,
      orgName: yup.string().required("What's your organization?"),
      type: yup.string().oneOf(professionalTypeValues).required("Who're you?"),
    });

  return yup.object().shape(rules);
};

const CompleteAccount = () => {
  const [checked, setChecked] = useState(false);
  const [updateClient, { loading }] = useMutation(UPDATE_CLIENT);
  const [updateProfessional] = useMutation(UPDATE_PROFESSIONAL);
  const [createOrganization] = useCreateOrganization();
  const { push } = useHistory();
  const { me, isPro, isOrgMember } = useCurrentUser();

  const sharedCalcId = localStorage.getItem('sharedCalcId');

  // ensure this page is only accessible to users with incomplete profiles
  const clientProfileName = useMemo(() => me?.client?.profile?.firstName, [me]);
  const proProfileName = useMemo(() => me?.professional?.profile?.firstName, [me]);

  if (
    (clientProfileName && clientProfileName !== 'You') ||
    (proProfileName && proProfileName !== 'You')
  ) {
    push('/');
  }

  const handleSubmitForm = useCallback(
    ({ firstName, lastName, type, orgName, orgType }) => {
      const variables = {
        data: {
          profile: {
            update: {
              firstName,
              lastName,
            },
          },
        },
        where: {
          id: me.client?.id || me.professional?.id,
        },
      };

      if (isPro) variables.data.type = type;
      const updateUser = isPro ? updateProfessional : updateClient;

      if (isPro) {
        createOrganization({
          variables: {
            data: {
              name: orgName,
              type: orgType,
            },
          },
        });
      }

      updateUser({ variables })
        .then(() => {
          const dataLayer = window.dataLayer || [];
          dataLayer.push({ ecommerce: null });
          dataLayer.push({
            event: 'complete_registration',
            traffic_type:
              window.location.hostname === 'www.divorcepath.com' ? 'external' : 'internal',
          });
          toast.success('Profile completed');
          if (sharedCalcId) {
            push(`shared-calculation/${sharedCalcId}`);
          }
        })
        .catch(err => err.graphQLErrors.map(({ message }) => toast.error(message)));
    },
    [me, isPro, updateProfessional, updateClient, push, sharedCalcId, createOrganization],
  );

  const isVisibleInput = useMemo(() => isPro && !isOrgMember, [isPro, isOrgMember]);

  return (
    <AuthPage>
      <Card className='complete-account-card mb-0'>
        <CardBody>
          <div className='text-center mb-3'>
            <h6 className='h3 mt-3'>Complete your account</h6>
            <p className='text-muted mb-0'>Find your path.</p>
          </div>

          <Formik
            enableReinitialize
            validateOnBlur={false}
            initialValues={initialValues}
            validationSchema={schema(isPro, isOrgMember)}
            onSubmit={handleSubmitForm}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                {inputs.map(input => (
                  <TextInput {...input} key={input.name} prepend='user' />
                ))}

                {isVisibleInput && (
                  <CustomSelect
                    className='mb-3'
                    label='Professional type'
                    name='type'
                    options={professionalTypes}
                  />
                )}

                {isVisibleInput && (
                  <TextInput
                    label='Organization name'
                    name='orgName'
                    placeholder='Divorcepath Corp.'
                  />
                )}

                {isVisibleInput && (
                  <CustomSelect
                    className='mb-3'
                    label='Organization type'
                    name='orgType'
                    options={organizationTypes}
                  />
                )}

                <div className='custom-control custom-checkbox'>
                  <input
                    className='custom-control-input'
                    name='registerCheckbox'
                    id='customCheckRegister'
                    onChange={() => setChecked(!checked)}
                    type='checkbox'
                  />
                  <label
                    className={classNames('custom-control-label', {
                      checked: checked ? 'checked' : '',
                    })}
                    htmlFor='customCheckRegister'
                  >
                    <span>I agree to email product updates and marketing</span>
                  </label>
                </div>

                <Button type='submit' className='mb-3 mt-3' disabled={loading}>
                  Complete profile
                </Button>
              </form>
            )}
          </Formik>
        </CardBody>
      </Card>
    </AuthPage>
  );
};

export default CompleteAccount;
