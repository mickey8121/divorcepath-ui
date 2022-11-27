import React, { useCallback } from 'react';

import { Label } from 'reactstrap';
import { useMutation } from '@apollo/client';

import Button from 'components/common/Button';

import useModal from 'hooks/useModal';
import useConfirm from 'hooks/useConfirm';
import useCurrentUser from 'hooks/useCurrentUser';

import ORGANIZATION_QUERY from 'graphql/queries/organization/organization';
import UPDATE_ORGANIZATION from 'graphql/mutations/organization/updateOrganization';

import LocationItem from './LocationItem';

const Locations = ({ locations, organizationId }) => {
  const { open } = useModal('CREATE_LOCATION');
  const { open: openEditModal } = useModal('EDIT_LOCATION');

  const [updateOrganization] = useMutation(UPDATE_ORGANIZATION);
  const { me } = useCurrentUser();

  const confirm = useConfirm({
    title: 'Are you sure you want to delete a location?',
    negativeBtnLabel: 'Not this time',
    positiveBtnLabel: 'Delete location',
  });

  const removeLocation = useCallback(
    async locationId => {
      if (!(await confirm())) return;

      updateOrganization({
        variables: {
          where: {
            id: organizationId,
          },
          data: {
            locations: {
              delete: [
                {
                  id: locationId,
                },
              ],
            },
          },
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateOrganization: {
            __typename: 'Organization',
            location: {
              __typename: 'OrganizationLocation',
              id: locationId,
            },
          },
        },
        update: (proxy, { data }) => {
          const removedLocationId = data.updateOrganization.location?.id;
          const variables = { where: { userId: me.id } };

          const cachedData = proxy.readQuery({
            query: ORGANIZATION_QUERY,
            variables,
          });

          const newData = {
            ...cachedData,
            organization: {
              ...cachedData.organization,
              locations: cachedData.organization.locations.filter(
                location => location.id !== removedLocationId,
              ),
            },
          };

          if (removedLocationId) {
            proxy.writeQuery({
              query: ORGANIZATION_QUERY,
              variables,
              data: newData,
            });
          }
        },
      });
    },
    [me.id, organizationId, updateOrganization, confirm],
  );

  return (
    <div className='location-form'>
      <Label className='form-control-label'>Locations</Label>
      {locations?.map(l => (
        <LocationItem
          location={l}
          key={l?.id}
          edit={() => openEditModal({ organizationId, location: l })}
          remove={() => removeLocation(l?.id)}
        />
      ))}
      <Button color='link' size='lg' leftIcon='plus' onClick={() => open({ organizationId })}>
        Add location
      </Button>
    </div>
  );
};

export default Locations;
