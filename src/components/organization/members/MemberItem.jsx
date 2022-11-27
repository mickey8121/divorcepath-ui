/* eslint-disable no-underscore-dangle */
import React, { useMemo, Fragment } from 'react';

import { capitalize } from 'lodash';
import dayjs from 'dayjs';
import classNames from 'classnames';

import Button from 'components/common/Button';

import useCurrentUser from 'hooks/useCurrentUser';

const MemberItem = ({ member, edit, remove, decline }) => {
  const { isOrgAdmin, me } = useCurrentUser();

  const roles = useMemo(
    () => `${capitalize(member.user?.professional?.type || member?.role)}`,
    [member],
  );
  const createdAt = useMemo(() => dayjs(member.createdAt).format('YYYY-DD-MM'), [member]);

  const memberName = useMemo(() => {
    const { firstName, lastName, email } = member.user?.professional?.profile || {};

    if (firstName && lastName) return `${firstName} ${lastName}`;

    return email || member?.email;
  }, [member]);

  const showBtn = useMemo(() => isOrgAdmin && me.id !== member?.user?.id, [me, isOrgAdmin, member]);

  const email = useMemo(() => member?.user?.professional?.profile?.email, [member]);

  const roleBadgeColor = useMemo(() => {
    if (member?.__typename === 'OrganizationInvite') return 'warning';
    if (!isOrgAdmin && me.id === member?.user?.id) return 'primary';

    return 'success';
  }, [member?.__typename, isOrgAdmin, me.id, member?.user?.id]);

  return (
    <div className='item-row'>
      <div className='item-description'>
        <span className='title'>
          <span>{`${memberName}`}</span>
          <span className={classNames('role-badge', roleBadgeColor)}>
            {!isOrgAdmin && me.id === member?.user?.id
              ? 'You'
              : capitalize(member?.status || member.role)}
          </span>
        </span>
        <div className='description'>
          {roles && <span>{roles}</span>}
          {email && <span>{email}</span>}
          <span>{createdAt}</span>
        </div>
      </div>

      <div className='item-col'>
        {showBtn && member?.__typename !== 'OrganizationInvite' && (
          <Fragment>
            <Button color='link' size='sm' onClick={edit} leftIcon='edit' />
            <Button color='red-link' size='sm' onClick={remove} leftIcon='trash' />
          </Fragment>
        )}
        {isOrgAdmin && member?.__typename === 'OrganizationInvite' && (
          <Button color='red-link' size='sm' onClick={decline} leftIcon='trash' />
        )}
      </div>
    </div>
  );
};

export default MemberItem;
