import React from 'react';

import EditMemberModal from 'components/modals/members/EditMemberModal';
import InviteModal from 'components/modals/members/InviteModal';

import MembersList from 'components/organization/members/MembersList';

import useCurrentUser from 'hooks/useCurrentUser';

const Members = ({ members, organizationId }) => {
  const { isFreeSub, isOrgAdmin } = useCurrentUser();

  return (
    <div className='update-form org-members-form'>
      <div className='inputs-container'>
        <div className='left-side'>
          <h4 className='title'>Organization Members</h4>
          <p className='subtitle'>
            Invite professional users to join your organization. Members of the same organization
            can view client profile information and create support calculations for all clients of
            the organization.
          </p>
          {isFreeSub && !isOrgAdmin && (
            <p className='subtitle'>Your subscription is being managed through your organization</p>
          )}
          {isFreeSub && isOrgAdmin && (
            <p className='subtitle'>
              You must upgrade your subscription to invite others to join your organization.
            </p>
          )}
        </div>
        <div className='right-side'>
          <MembersList members={members} organizationId={organizationId} />
        </div>
      </div>

      <EditMemberModal />
      <InviteModal />
    </div>
  );
};

export default Members;
