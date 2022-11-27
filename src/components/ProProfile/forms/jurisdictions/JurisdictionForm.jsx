import React, { useCallback } from 'react';

import { useMutation } from '@apollo/client';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { Formik } from 'formik';
import { Form } from 'reactstrap';

import TextInput from 'components/common/inputs/TextInput';

import useModal from 'hooks/useModal';
import useCurrentUser from 'hooks/useCurrentUser';

import ME from 'graphql/queries/user/me';
import UPDATE_PROFESSIONAL from 'graphql/mutations/professional/updateProfessional';

const inputs = [
  {
    name: `jurisdiction`,
    placeholder: 'Jurisdiction',
  },
  {
    name: `year`,
    placeholder: 'Year',
    type: 'number',
    containerClassName: 'mb-0',
  },
];

const defaultJurisdiction = {
  jurisdiction: '',
  year: undefined,
};

const professionalString = yup.string().max(500, 'Too Long!').nullable().required('Required field');

const validation = yup.object().shape({
  jurisdiction: professionalString,
  year: yup.number().nullable(),
});

const JurisdictionForm = ({ formId, type }) => {
  const { me } = useCurrentUser();

  const [updateProfessional] = useMutation(UPDATE_PROFESSIONAL);

  const { close, setLoading } = useModal('CREATE_JURISDICTION');
  const {
    options: initialJurisdictionOptions,
    close: closeEditJurisdictionModal,
    setLoading: setLoadingToEditModal,
  } = useModal('EDIT_JURISDICTION');

  const handleSubmitForm = useCallback(
    async formValues => {
      const { __typename, ...values } = formValues;

      setLoading(true);
      setLoadingToEditModal(true);

      try {
        if (type === 'CREATE') {
          await updateProfessional({
            variables: {
              data: {
                jurisdiction: {
                  create: {
                    ...values,
                    year: values?.year === null ? null : parseInt(values?.year || 0, 10),
                  },
                },
              },
              where: {
                id: me.professional?.id,
              },
            },
            optimisticResponse: {
              __typename: 'Mutation',
              updateProfessional: {
                __typename: 'Professional',
                jurisdiction: {
                  __typename: 'ProfessionalJurisdiction',
                  id: '',
                  ...values,
                },
              },
            },
            update: (proxy, { data }) => {
              const newJurisdiction = data.updateProfessional.jurisdiction;

              const cachedData = proxy.readQuery({ query: ME });

              const newData = {
                ...cachedData,
                professional: {
                  ...cachedData.me?.professional,
                  jurisdiction: newJurisdiction
                    ? [...cachedData?.me?.professional?.jurisdiction, newJurisdiction]
                    : cachedData.me?.professional?.jurisdiction,
                },
              };

              proxy.writeQuery({
                query: ME,
                data: newData,
              });
            },
          }).catch(err => err.graphQLErrors.map(({ message }) => toast.error(message)));
        } else {
          await updateProfessional({
            variables: {
              where: {
                id: me?.professional?.id,
              },
              data: {
                jurisdiction: {
                  update: {
                    data: {
                      ...values,
                      year: values?.year === null ? null : parseInt(values?.year || 0, 10),
                    },
                    where: {
                      id: initialJurisdictionOptions?.jurisdiction?.id,
                    },
                  },
                },
              },
            },
          });
        }
      } finally {
        setLoading(false);
        setLoadingToEditModal(false);

        close();
        closeEditJurisdictionModal();
      }
    },
    [
      me.professional,
      updateProfessional,
      initialJurisdictionOptions,
      type,
      setLoading,
      setLoadingToEditModal,
      close,
      closeEditJurisdictionModal,
    ],
  );

  return (
    <Formik
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
      initialValues={initialJurisdictionOptions?.jurisdiction || defaultJurisdiction}
      validationSchema={validation}
      onSubmit={handleSubmitForm}
    >
      {({ handleSubmit }) => (
        <Form id={formId} onSubmit={handleSubmit} className='create-location-form'>
          {inputs.map(input => (
            <div key={input.name} className='location-col'>
              <TextInput {...input} />
            </div>
          ))}
        </Form>
      )}
    </Formik>
  );
};
export default JurisdictionForm;
