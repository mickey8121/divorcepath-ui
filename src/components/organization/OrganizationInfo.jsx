import React from 'react';

import Members from 'components/organization/members/Members';

const OrganizationInfo = ({ organization }) => (
  <div className='update-form-container'>
    <div className='update-form-header'>
      <h4>Your Organization</h4>
    </div>
    <div className='update-form-content'>
      <div className='organization-info-container'>
        <div className='organization-info'>
          {organization?.logo ? (
            <img src={organization?.logo} alt='' />
          ) : (
            <div className='org-logo-placeholder'>
              <span>{organization?.name?.charAt(0)}</span>
            </div>
          )}
          <div className='organization-description'>
            <h5 className='title'>{organization.name}</h5>
            <p className='description'>{organization.description}</p>
          </div>
        </div>
      </div>
      <div className='divider' />
      <Members members={organization?.members || []} />
    </div>
  </div>
);

export default OrganizationInfo;
