import React, { useCallback, useMemo, useState, Fragment } from 'react';

import { Formik, yupToFormErrors } from 'formik';
import sortBy from 'lodash/sortBy';

import LocationPrompt from 'components/common/LocationPrompt';

import Address from 'components/ClientProfile/forms/Address';
import { regionsKeys } from 'components/calculations/utils/regionNames';
import scrollToError from 'components/calculations/sidebar/scrollToError';

import useCurrentUser from 'hooks/useCurrentUser';

import { canadianProvinces, canadianTerritories } from 'utils/places';
import { addressSchema } from 'utils/schemas';

const inputs = [
  {
    type: 'text',
    name: 'city',
    label: 'City',
    placeholder: 'City',
  },
  {
    type: 'select',
    name: 'residence',
    label: 'Residence',
    placeholder: 'Residence',
    options: sortBy([...canadianProvinces, ...canadianTerritories], 'name'),
  },
  {
    type: 'text',
    name: 'postal',
    label: 'Postal Code',
    placeholder: 'Postal code or Zip Code',
  },
  {
    type: 'text',
    name: 'country',
    label: 'Country',
    placeholder: 'Country',
  },
];

const AddressForm = ({ updateUser, user: userData, isRoleClient }) => {
  const [loading, setLoading] = useState(false);
  const { me } = useCurrentUser();
  const defaultResidence = {
    value: me?.professional?.locations?.[0]?.residence || 'AB',
    label: regionsKeys[me?.professional?.locations?.[0]?.residence || 'AB'],
  };

  const handleSubmitAddress = useCallback(
    ({ street1, street2, city, postal, country, residence }) => {
      const variables = {
        data: {
          address: {
            upsert: {
              update: {
                street1: street1 || '',
                street2: street2 || '',
                city: city || '',
                residence: residence || '',
                postal: postal || '',
                country: country || '',
              },
              create: {
                street1: street1 || '',
                street2: street2 || '',
                city: city || '',
                residence: residence || '',
                postal: postal || '',
                country: country || '',
              },
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

  const initialValues = useMemo(() => {
    const address = userData.client?.address || {};

    return {
      street1: address.street1 || '',
      street2: address.street2 || '',
      city: address.city || '',
      residence: address.residence || defaultResidence.label,
      postal: address.postal || null,
      country: address.country || 'Canada',
    };
  }, [userData, defaultResidence.label]);

  const description = useMemo(
    () =>
      `Enter your ${
        isRoleClient ? '' : "client's"
      } current address. Support calculations depend on which province ${
        isRoleClient ? 'you live' : 'your client lives'
      } in, so we'll use the province or territory as the default residence for calculations as well`,
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
      onSubmit={handleSubmitAddress}
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
            formType='address'
            inputs={inputs}
            isRoleClient={isRoleClient}
          />
        </Fragment>
      )}
    </Formik>
  );
};

export default AddressForm;
