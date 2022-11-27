import React, { useMemo } from 'react';

import { useQuery } from '@apollo/client';

import Loading from 'components/common/Loading';

import UpdateOrganization from 'components/organization/UpdateOrganization';
import MembersList from 'components/organization/members/Members';
import OrganizationInfo from 'components/organization/OrganizationInfo';
import OrgLogoForm from 'components/organization/OrgLogoForm';
import OrganizationLocationContainer from 'components/organization/location/OrganizationLocationContainer';

import useOrganizationQuery from 'hooks/useOrganizationQuery';
import useCurrentUser from 'hooks/useCurrentUser';

import ORGANIZATION_INVITES from 'graphql/queries/organization/organizationInvites';

const Organization = () => {
  const user = useCurrentUser();

  const { data, loading } = useOrganizationQuery(user?.me?.id);

  const { data: orgInvites } = useQuery(ORGANIZATION_INVITES, {
    variables: { where: { status: { equals: 'PENDING' } } },
  });

  const invites = useMemo(() => orgInvites?.organizationInvites || [], [orgInvites]);

  const organization = useMemo(() => data?.organization, [data]);

  if (loading) return <Loading page />;

  if (organization && !user.isOrgAdmin) return <OrganizationInfo organization={organization} />;

  return (
    <div className='update-form-container'>
      <div className='update-form-header'>
        <h4>Your Organization</h4>
      </div>
      <div className='update-form-content'>
        <UpdateOrganization organization={organization} />
        <div className='divider' />
        <OrganizationLocationContainer organization={organization} />
        <div className='divider' />
        <div className='update-form logo-form-container'>
          <div className='inputs-container'>
            <div className='left-side'>
              <h4 className='title'>Organization logo</h4>
              <p className='subtitle'>
                The uploaded image must be at least 200x200 in size and the height must not exceed
                the width.
              </p>
              <p className='subtitle'>* required</p>
            </div>
            <div className='right-side'>
              <div className='logo'>
                <OrgLogoForm organization={organization} type='logo' />
              </div>
            </div>
          </div>
        </div>
        <div className='divider' />
        <MembersList members={[...(organization?.members || []), ...invites]} />
      </div>
    </div>
  );
};

export default Organization;
