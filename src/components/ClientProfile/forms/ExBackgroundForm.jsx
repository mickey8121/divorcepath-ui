import React, { useCallback, useMemo, useState, Fragment } from 'react';

import { Formik, yupToFormErrors } from 'formik';

import LocationPrompt from 'components/common/LocationPrompt';

import scrollToError from 'components/calculations/sidebar/scrollToError';

import customGet from 'utils/get';
import { backgroundSchema } from 'utils/schemas';

import Background from './Background';

const ExBackgroundForm = ({ updateUser, user: userData, isRoleClient }) => {
  const [loading, setLoading] = useState(false);

  const exProfile = useMemo(() => customGet(userData, 'client.exProfile', null), [userData]);
  const initialValues = useMemo(
    () => ({
      firstName: exProfile?.firstName,
      lastName: exProfile?.lastName,
      middleName: exProfile?.middleName,
      email: exProfile?.email || null,
      phone: exProfile?.phone || null,
      gender: exProfile?.gender,
      birthDate: exProfile?.birthDate ? new Date(exProfile?.birthDate) : null,
    }),
    [exProfile],
  );

  const handleSubmitForm = useCallback(
    ({ email, gender, birthDate, phone, firstName, lastName, middleName, hasNewPartner }) => {
      const variables = {
        data: {
          exProfile: {
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
          id: userData?.client?.id,
        },
      };

      setLoading(true);

      updateUser(variables).finally(() => setLoading(false));
    },
    [userData, updateUser],
  );

  const validateForm = useCallback(
    values =>
      backgroundSchema
        .validate(values, { abortEarly: false, context: { isClient: isRoleClient, isEx: true } })
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
      validate={validateForm}
      onSubmit={handleSubmitForm}
    >
      {({ values, errors, handleSubmit, touched }) => (
        <Fragment>
          <LocationPrompt initialValues={initialValues} values={values} />
          <Background
            loading={loading}
            values={values}
            errors={errors}
            handleSubmit={handleSubmit}
            touched={touched}
            formType='exBackground'
            isRoleClient={isRoleClient}
          />
        </Fragment>
      )}
    </Formik>
  );
};

export default ExBackgroundForm;
