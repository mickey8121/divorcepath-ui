import React, { useCallback, useMemo, useState } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { FormikProvider, useFormik } from 'formik';
import { toast } from 'react-toastify';
import isEmpty from 'lodash/isEmpty';

import CustomSelect from 'components/common/inputs/Select/SelectField';
import TextInput from 'components/common/inputs/TextInput';
import ToggleCheckbox from 'components/common/inputs/ToggleCheckbox';

import difference from 'components/calculations/utils/difference';

import usePrevValue from 'hooks/usePrevValue';

import organizationTypes from 'utils/organizationTypes';

import CLIENTS from 'graphql/queries/client/paginatedClients';
import UPDATE_ORGANIZATION from 'graphql/mutations/organization/updateOrganization';

const UpdateOrganization = ({ organization }) => {
  const { refetch: refetchClients } = useQuery(CLIENTS, {
    skip: true,
    variables: {
      first: 10,
      orderBy: [{ type: 'asc' }, { createdAt: 'desc' }],
      where: { NOT: { type: { equals: 'NOT_RETAINED' } } },
    },
  });

  const [updateOrganization] = useMutation(UPDATE_ORGANIZATION);

  const [checked, setChecked] = useState(organization?.clientsShared || false);
  const prevChecked = usePrevValue(checked);

  const initialValues = useMemo(
    () => ({
      name: organization?.name,
      description: organization?.description,
      type: organization?.type,
    }),
    [organization],
  );

  const onSubmit = useCallback(
    values => {
      const differenceData = difference(values, initialValues);

      if (isEmpty(differenceData) && checked !== prevChecked) return null;

      const { name, description, type } = values;

      updateOrganization({
        variables: {
          where: {
            id: organization?.id,
          },
          data: {
            name,
            description,
            type,
            clientsShared: checked,
          },
        },
      }).then(() => {
        toast.success('The information about the organization was successfully updated');

        refetchClients();
      });
    },
    [organization?.id, updateOrganization, checked, refetchClients, prevChecked, initialValues],
  );

  const formik = useFormik({
    initialValues,
    onSubmit,
    enableReinitialize: true,
  });

  const { handleSubmit } = formik;

  const handleChange = useCallback(() => {
    setChecked(prev => !prev);

    handleSubmit();
  }, [handleSubmit]);

  return (
    <FormikProvider value={formik}>
      <form className='update-form organization-form'>
        <div className='inputs-container'>
          <div className='left-side'>
            <h4 className='title'>Organizational information</h4>
            <p className='subtitle'>Fill out detailed information about your organization.</p>
            <p className='subtitle'>* required fields</p>
          </div>
          <div className='right-side'>
            <TextInput
              size='md'
              name='name'
              label='Organization Name'
              placeholder='Organization Name'
              onBlur={handleSubmit}
              isRequired
            />
            <TextInput
              size='md'
              name='description'
              label='Description'
              placeholder='Description'
              onBlur={handleSubmit}
              isRequired
            />

            <CustomSelect
              size='md'
              className='mb-3'
              label='Organization type'
              placeholder='Organization type'
              name='type'
              onBlur={handleSubmit}
              isRequired
              options={organizationTypes}
            />

            <ToggleCheckbox onChange={handleChange} isChecked={checked} className='toggle-clients'>
              <span className='all-clients-toggle'>
                <span className='title'>All Members Can Access All Clients</span>
                <span className='description'>
                  If toggled off, only admin users will be able to see other users' clients
                </span>
              </span>
            </ToggleCheckbox>
          </div>
        </div>
      </form>
    </FormikProvider>
  );
};

export default UpdateOrganization;
