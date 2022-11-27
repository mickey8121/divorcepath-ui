import React, { useCallback, useMemo, useState, Fragment } from 'react';

import { Formik, yupToFormErrors } from 'formik';

import LocationPrompt from 'components/common/LocationPrompt';

import scrollToError from 'components/calculations/sidebar/scrollToError';

import { backgroundSchema } from 'utils/schemas';

import Background from './Background';

const BackgroundForm = ({ updateUser, user: userData, isRoleClient }) => {
  const [loading, setLoading] = useState(false);

  const initialValues = useMemo(() => {
    const client = userData?.client?.profile;

    return {
      firstName: client?.firstName,
      lastName: client?.lastName,
      middleName: client?.middleName,
      email: client?.email || null,
      phone: client?.phone || null,
      gender: client?.gender,
      birthDate: client?.birthDate ? new Date(client?.birthDate) : null,
    };
  }, [userData]);

  const handleSubmitForm = useCallback(
    ({ email, gender, birthDate, phone, firstName, lastName, middleName, hasNewPartner }) => {
      const variables = {
        data: {
          profile: {
            update: {
              email: email || null,
              firstName: firstName || null,
              lastName: lastName || null,
              middleName: middleName || null,
              phone: phone || null,
              birthDate: birthDate || null,
              gender: gender || null,
              hasNewPartner,
            },
          },
        },
        where: {
          id: userData.client.id,
        },
      };

      setLoading(true);

      updateUser(variables).finally(() => setLoading(false));
    },
    [updateUser, userData],
  );

  const validateForm = useCallback(
    values =>
      backgroundSchema
        .validate(values, {
          abortEarly: false,
          context: { isClient: isRoleClient, isEx: !isRoleClient },
        })
        .then(() => {})
        .catch(err => {
          setTimeout(() => scrollToError(), 0);
          return yupToFormErrors(err);
        }),
    [isRoleClient],
  );

  return (
    <Formik
      validateOnBlur={false}
      enableReinitialize
      initialValues={initialValues}
      onSubmit={handleSubmitForm}
      validate={validateForm}
    >
      {({ values, errors, handleSubmit, touched }) => (
        <Fragment>
          <LocationPrompt initialValues={initialValues} values={values} />
          <Background
            loading={loading}
            values={values}
            errors={errors}
            touched={touched}
            handleSubmit={handleSubmit}
            formType='background'
            isRoleClient={isRoleClient}
          />
        </Fragment>
      )}
    </Formik>
  );
};

export default BackgroundForm;
