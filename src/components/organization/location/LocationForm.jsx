import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { useFormik, FormikProvider } from 'formik';
import { Form } from 'reactstrap';
import uniqueId from 'lodash/uniqueId';
import sortBy from 'lodash/sortBy';
import uniqBy from 'lodash/uniqBy';
import omit from 'lodash/omit';

import TextInput from 'components/common/inputs/TextInput';
import Select from 'components/common/inputs/Select/SelectField';
import CreatableSelect from 'components/common/inputs/Select/CreatableSelect';

import useModal from 'hooks/useModal';
import useCurrentUser from 'hooks/useCurrentUser';

import { defaultValues, formInputs, provinceOptions, validationSchema } from 'helpers/locationForm';

import ORGANIZATION_QUERY from 'graphql/queries/organization/organization';
import UPDATE_ORGANIZATION from 'graphql/mutations/organization/updateOrganization';
import ALL_CITY from 'graphql/sanity/allCity';

const LocationForm = ({ formId, type }) => {
  const { me } = useCurrentUser();

  const [updateOrganization, { loading: loadingUpdateOrg }] = useMutation(UPDATE_ORGANIZATION);

  const {
    options: { organizationId, location } = {},
    close,
    setLoading,
  } = useModal(type === 'CREATE' ? 'CREATE_LOCATION' : 'EDIT_LOCATION');

  // hide Canada(CDN) option for locations, but show it if has been selected before
  const currentProvinceOptions = useMemo(() => {
    const copiedOptions = [...provinceOptions];
    const canadaOptionIndex = provinceOptions.findIndex(o => o.value === 'CDN');

    if (canadaOptionIndex !== -1)
      if (location?.data?.residence === 'CDN') {
        copiedOptions[canadaOptionIndex].isDisabled = true;
      } else copiedOptions.splice(canadaOptionIndex, 1);

    return copiedOptions;
  }, [location?.data?.residence]);

  const initialValues = useMemo(() => {
    const values = { ...(omit(location, ['__typename', 'id']) || defaultValues) };

    values.city = values.city ? { value: values.city, label: values.city } : null;

    return values;
  }, [location]);

  const [regionShorthand, setRegionShorthand] = useState(initialValues.residence);

  const { data: { allCity } = {}, loading: loadingCities } = useQuery(ALL_CITY, {
    variables: { where: { province: { shorthand: { eq: regionShorthand } } } },
  });

  useEffect(() => setLoading(loadingUpdateOrg), [loadingUpdateOrg, setLoading]);

  const cities = useMemo(
    () =>
      sortBy(
        uniqBy(
          [
            ...(allCity?.map(({ name }) => ({ value: name, label: name })) || []),
            ...(initialValues.city ? [initialValues.city] : []),
          ],
          'label',
        ),
        'label',
      ),
    [allCity, initialValues],
  );

  const createLocation = useCallback(
    async values => {
      const organization = me?.professional?.organization || {};
      const currentLocations = organization?.locations || [];

      const preparedValues = { ...values, city: values.city?.value || null };

      if (type === 'CREATE') {
        await updateOrganization({
          variables: {
            where: {
              id: organizationId,
            },
            data: {
              locations: {
                create: [preparedValues],
              },
            },
          },
          optimisticResponse: {
            updateOrganization: {
              __typename: 'Organization',
              id: organizationId,

              ...organization,

              locations: [
                ...currentLocations,
                {
                  __typename: 'OrganizationLocation',
                  id: uniqueId(),
                  residence: null,
                  street1: null,
                  street2: null,
                  city: null,
                  email: null,
                  website: null,
                  ...preparedValues,
                },
              ],
            },
          },
          update: (proxy, { data }) => {
            const newLocation = data.updateOrganization.location;
            const variables = { where: { userId: me.id } };

            const cachedData = proxy.readQuery({
              query: ORGANIZATION_QUERY,
              variables,
            });

            const newData = {
              ...cachedData,
              organization: {
                ...cachedData.organization,
                locations: newLocation
                  ? [...cachedData.organization.locations, newLocation]
                  : cachedData.organization.locations,
              },
            };

            proxy.writeQuery({
              query: ORGANIZATION_QUERY,
              variables,
              data: newData,
            });
          },
        });
      } else {
        await updateOrganization({
          variables: {
            where: {
              id: organizationId,
            },
            data: {
              locations: {
                update: {
                  data: {
                    ...preparedValues,
                  },
                  where: {
                    id: location?.id,
                  },
                },
              },
            },
          },
        });
      }

      close();
    },
    [me, type, close, updateOrganization, organizationId, location],
  );

  const formik = useFormik({
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
    initialValues,
    validationSchema,
    onSubmit: createLocation,
  });

  const { handleSubmit, setFieldValue } = formik;

  const renderFormField = useCallback(
    formInput => {
      if (!formInput?.name) return null;

      return (
        <div key={formInput.name} className='location-col'>
          {(() => {
            switch (formInput.name) {
              case 'residence':
                return (
                  <Select
                    {...formInput}
                    options={currentProvinceOptions}
                    className='mb-3'
                    onChange={({ value }) => {
                      setFieldValue(formInput.name, value);
                      setRegionShorthand(value);
                      setFieldValue('city', null);
                    }}
                  />
                );

              case 'city':
                return (
                  <CreatableSelect
                    {...formInput}
                    className='mb-3'
                    placeholder={loadingCities ? 'Loading cities...' : formInput.placeholder}
                    disabled={loadingCities}
                    options={cities}
                    formatCreateLabel={newOptionName => `Choose "${newOptionName}"`}
                  />
                );
              default:
                return <TextInput {...formInput} />;
            }
          })()}
        </div>
      );
    },
    [cities, currentProvinceOptions, loadingCities, setFieldValue],
  );

  return (
    <FormikProvider value={formik}>
      <Form id={formId} onSubmit={handleSubmit} className='create-location-form'>
        {formInputs.map(renderFormField)}
      </Form>
    </FormikProvider>
  );
};
export default LocationForm;
