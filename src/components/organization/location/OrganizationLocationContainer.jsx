/* eslint-disable react/no-array-index-key */
import React from 'react';

import CreateLocationModal from 'components/modals/location/CreateLocationModal';
import EditLocationModal from 'components/modals/location/EditLocationModal';

import Locations from 'components/organization/location/Locations';

const OrganizationLocationContainer = ({ organization }) => {
  return (
    <div className='update-form organization-locations-form'>
      <div className='inputs-container'>
        <div className='left-side'>
          <h4 className='title'>Organization Locations</h4>
          <p className='subtitle'>
            Add locations for your organization. Pro users can select their location in their
            profile. Locations are used to set the default location of new clients and to customize
            reports.
          </p>
        </div>
        <div className='right-side'>
          <Locations locations={organization?.locations} organizationId={organization?.id} />
        </div>
      </div>

      <CreateLocationModal />
      <EditLocationModal />
    </div>
  );
};

export default OrganizationLocationContainer;
