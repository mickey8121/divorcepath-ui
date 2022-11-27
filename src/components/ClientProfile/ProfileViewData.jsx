/* eslint-disable react/jsx-one-expression-per-line */
import React, { useMemo } from 'react';

import dayjs from 'dayjs';
import { Card, CardHeader, CardBody } from 'reactstrap';

import Biography from 'components/ClientProfile/Biography.jsx';

import getDefaultAvatar from 'utils/getDefaultAvatar';

const ProfileViewData = ({ client, clientName }) => {
  const src = useMemo(() => getDefaultAvatar(client?.profile.gender), [client]);

  return (
    <Card className='shadow-hover mb-6 mb-lg-3 profile-card'>
      <CardHeader className='py-4 pl-4'>
        <div className='d-flex justify-content-between align-items-center'>
          <div className='d-flex align-items-center'>
            <span className='avatar'>
              <img alt='placeholder' src={src} className='img-saturate' />
            </span>
            <div className='avatar-content'>
              <h5 className='mb-0'>{clientName}</h5>
              <small className='d-block text-muted'>
                {client?.profile?.birthDate
                  ? `${dayjs().diff(client?.profile?.birthDate, 'years')} / `
                  : ''}
                {client?.profile?.gender === 'MALE' ? 'M' : 'F'}
                {client?.address?.city && client?.address?.residence && (
                  <span className='d-none d-md-inline'>
                    {` / ${client?.address?.city}, ${client?.address?.residence}`}
                  </span>
                )}
              </small>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardBody className='pb-4'>
        <Biography client={client} />
      </CardBody>
    </Card>
  );
};

export default ProfileViewData;
