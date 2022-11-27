/* eslint-disable react/no-array-index-key */
import React, { useCallback, useMemo } from 'react';

import classNames from 'classnames';
import dayjs from 'dayjs';
import { truncate } from 'lodash';
import { Progress } from 'reactstrap';

import Icon from 'components/common/Icon';

import ClientType from 'components/ClientProfile/ClientType';

import getProfileName from 'utils/getProfileName';
import getCompleteProfilePercent from 'utils/getCompleteProfilePercent';

const ClientCardHeader = ({ client, expandedClient, setExpandedClient }) => {
  const {
    id,
    profile,
    exProfile,
    profileProgress: clientProfileProgress,
    relationship,
    children,
    professionals,
    type,
  } = useMemo(() => client, [client]);

  const { separationDate, cohabitationDate } = useMemo(() => relationship || {}, [relationship]);

  const clientName = useMemo(
    () => getProfileName(client?.profile) || client?.profile.email,
    [client],
  );
  const childrenLength = useMemo(() => children?.length || 0, [children]);

  const isPotential = useMemo(() => type === 'POTENTIAL', [type]);

  const profileProgress = useMemo(
    () => getCompleteProfilePercent(clientProfileProgress),
    [clientProfileProgress],
  );
  const progressColor = useMemo(
    () => (profileProgress > 80 ? 'success' : profileProgress > 30 ? 'warning' : 'danger'),
    [profileProgress],
  );

  const handleSetExpanded = useCallback(
    () => (expandedClient ? setExpandedClient(false) : setExpandedClient(client.id)),
    [client.id, expandedClient, setExpandedClient],
  );

  const clientShortInfo = useMemo(() => {
    const isMale = profile?.gender === 'MALE';

    if (!profile?.birthDate) return isMale ? 'Male' : 'Female';

    return `${dayjs().diff(profile?.birthDate, 'years')} / ${isMale ? 'M' : 'F'}`;
  }, [profile?.birthDate, profile?.gender]);

  const exShortInfo = useMemo(() => {
    const isMale = exProfile?.gender === 'MALE';

    if (!exProfile?.birthDate) return isMale ? 'Ex Male' : 'Ex Female';

    return `Ex ${dayjs().diff(exProfile?.birthDate, 'years')} / ${isMale ? 'M' : 'F'}`;
  }, [exProfile?.birthDate, exProfile?.gender]);

  return (
    <div
      className={classNames('client-item', { 'cursor-pointer': !isPotential })}
      onClick={handleSetExpanded}
      name={id}
    >
      <div className='client-item-content' name={type}>
        <div className='pro-description'>
          <h6 className='progress-text text-md d-block text-limit'>{clientName}</h6>
          <ClientType client={client} />
        </div>

        <Progress value={profileProgress} className='progress-xs mb-0' color={progressColor} />

        <div className='client-profile-short-info'>
          <div className='short-info'>
            <span className='info-item'>{clientShortInfo}</span>
            <span className='info-item'>{exShortInfo}</span>

            <span className='info-item'>
              {`${childrenLength} ${childrenLength === 1 ? 'Child' : 'Children'}`}
            </span>

            {cohabitationDate && separationDate && (
              <span className='info-item'>
                {`${dayjs(separationDate).diff(cohabitationDate, 'years')} Year Relationship`}
              </span>
            )}
          </div>

          <div className='short-info'>
            {!!profile?.matter && <div className='info-item'>{profile?.matter?.number}</div>}

            {professionals?.map((pro, index) => (
              <div key={index} className='info-item'>
                {truncate(pro?.profile.lastName, { length: 20, omission: '...' })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='btn-icon-only w-30'>
        <div className='btn-icon-only float-right pl-3'>
          <span className='btn-inner--icon'>
            <Icon name={`arrow-${expandedClient ? 'up' : 'down'}`} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ClientCardHeader;
