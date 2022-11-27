import React, { useCallback, useMemo, useState, Fragment } from 'react';

import { Formik, yupToFormErrors } from 'formik';

import LocationPrompt from 'components/common/LocationPrompt';

import Address from 'components/ClientProfile/forms/Address';
import { regionsKeys } from 'components/calculations/utils/regionNames';
import scrollToError from 'components/calculations/sidebar/scrollToError';

import useCurrentUser from 'hooks/useCurrentUser';

import { addressSchema } from 'utils/schemas';
import { canadianProvinces, canadianTerritories } from 'utils/places';

const inputs = [
  {
    type: 'text',
    name: 'city',
    label: 'City',
    placeholder: "Ex's city",
  },
  {
    type: 'select',
    name: 'residence',
    label: 'Residence',
    placeholder: "Ex's residence",
    options: [...canadianProvinces, ...canadianTerritories],
  },
  {
    type: 'text',
    name: 'postal',
    label: 'Postal Code',
    placeholder: "Ex's postal code or zip code",
  },
  {
    type: 'text',
    name: 'country',
    label: 'Country',
    placeholder: "Ex's country",
  },
];

const ExAddressForm = ({ updateUser, user: userData, isRoleClient }) => {
  const [loading, setLoading] = useState();
  const { me } = useCurrentUser();
  const defaultResidence = {
    value: me?.professional?.locations?.[0]?.residence || 'AB',
    label: regionsKeys[me?.professional?.locations?.[0]?.residence || 'AB'],
  };
  const initialValues = useMemo(() => {
    const address = userData?.client?.exAddress || {};

    return {
      street1: address.street1 || '',
      street2: address.street2 || '',
      city: address.city || '',
      residence: address.residence || defaultResidence.label,
      postal: address.postal || null,
      country: address.country || 'Canada',
    };
  }, [userData, defaultResidence.label]);

  const handleSubminForm = useCallback(
    ({ street1, street2, city, postal, country, residence }) => {
      const data = {
        street1: street1 || '',
        street2: street2 || '',
        city: city || '',
        residence: residence || '',
        postal: postal || '',
        country: country || '',
      };

      const variables = {
        data: {
          exAddress: {
            upsert: {
              update: data,
              create: data,
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
    [userData, updateUser],
  );

  const description = useMemo(
    () =>
      `We'll need your ${isRoleClient ? '' : 'client`s'} ex's current address for ${
        isRoleClient ? 'your legal documents and our' : 'the'
      } file. Support calculations depend on which province ${
        isRoleClient ? 'your ex lives' : 'each party resides'
      } in, so we'll use this address as the default address for calculations as well`,
    [isRoleClient],
  );

  const validateForm = useCallback(
    values =>
      addressSchema
        .validate(values, { abortEarly: false, context: { isClient: isRoleClient } })
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
      onSubmit={handleSubminForm}
    >
      {({ values, errors, handleSubmit }) => (
        <Fragment>
          <LocationPrompt initialValues={initialValues} values={values} />
          <Address
            loading={loading}
            description={description}
            values={values}
            errors={errors}
            handleSubmit={handleSubmit}
            formType='exAddress'
            inputs={inputs}
            isRoleClient={isRoleClient}
          />
        </Fragment>
      )}
    </Formik>
  );
};

export default ExAddressForm;
