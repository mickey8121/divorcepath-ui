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
    name: `institution`,
    placeholder: 'Institution',
  },
  {
    name: `degree`,
    placeholder: 'Degree',
  },
  {
    name: `abbreviation`,
    placeholder: 'Abbreviation',
  },
  {
    name: `year`,
    placeholder: 'Year',
    type: 'number',
    containerClassName: 'mb-0',
  },
];

const defaultDegree = {
  institution: '',
  degree: '',
  abbreviation: '',
  year: undefined,
};

const professionalString = yup.string().max(500, 'Too Long!').nullable().required('Required field');

const validation = yup.object().shape({
  institution: professionalString,
  degree: professionalString,
  abbreviation: professionalString,
  year: yup.number().nullable(),
});

const DegreeForm = ({ formId, type }) => {
  const { me } = useCurrentUser();

  const [updateProfessional] = useMutation(UPDATE_PROFESSIONAL);

  const { close, setLoading } = useModal('CREATE_DEGREE');
  const {
    options: initialDegreeOptions,
    close: closeEditDegreeModal,
    setLoading: setLoadingToEditModal,
  } = useModal('EDIT_DEGREE');

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
                degree: {
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
                degree: {
                  __typename: 'ProfessionalDegree',
                  id: '',
                  ...values,
                },
              },
            },
            update: (proxy, { data }) => {
              const newDegree = data.updateProfessional.degree;

              const cachedData = proxy.readQuery({ query: ME });

              const newData = {
                ...cachedData,
                professional: {
                  ...cachedData.me?.professional,
                  degree: newDegree
                    ? [...cachedData?.me?.professional?.degree, newDegree]
                    : cachedData.me?.professional?.degree,
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
                degree: {
                  update: {
                    data: {
                      ...values,
                      year: values?.year === null ? null : parseInt(values?.year || 0, 10),
                    },
                    where: {
                      id: initialDegreeOptions?.degree?.id,
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
        closeEditDegreeModal();
      }
    },
    [
      me.professional,
      updateProfessional,
      initialDegreeOptions,
      type,
      setLoading,
      setLoadingToEditModal,
      close,
      closeEditDegreeModal,
    ],
  );

  return (
    <Formik
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
      initialValues={initialDegreeOptions?.degree || defaultDegree}
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
export default DegreeForm;
