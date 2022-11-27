import React, { useMemo, useCallback } from 'react';

import { useParams, Link, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import dayjs from 'dayjs';

import Preloader from 'components/common/Preloader';
import ProfileUpgradeButton from 'components/common/ProfileUpgradeButton';

import AvatarSelector from 'components/ClientProfile/AvatarSelector';

import useCurrentUser from 'hooks/useCurrentUser';

import getUserName from 'utils/getUserName';
import getDefaultAvatar from 'utils/getDefaultAvatar';

import CLIENT from 'graphql/queries/client/clients';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ProfileHeader = () => {
  const { clientId } = useParams();
  const { me, isOrgMember, isOrgFounder } = useCurrentUser();
  const { data, loading, error } = useQuery(CLIENT, {
    variables: {
      _id: clientId,
    },
    skip: !clientId,
  });

  const userName = useMemo(() => getUserName(me), [me]);
  const user = useMemo(() => data?.user || me, [data, me]);

  const { profile, exProfile, address, relationship, children, exAddress } = user?.client || {};
  const { professional } = user || {};

  const { profile: proProfile } = user?.professional || {};

  const childrenLength = useMemo(() => children?.length || 0, [children]);

  const isPro = useMemo(() => user?.professional?.id, [user]);
  const userId = useMemo(() => user?.professional?.id || user?.client?.id, [user]);

  const avatar = useMemo(() => getDefaultAvatar(profile?.gender), [profile]);

  const userData = useMemo(
    () => ({
      proAvatar: isPro ? proProfile?.avatarUrl : avatar,
      avatar: profile?.avatarUrl || avatar,
      exName: `${exProfile?.firstName || ''} ${exProfile?.lastName || ''}`,
      gender: profile?.gender,
      clientGender: profile?.gender === 'MALE' ? 'M' : 'F',
      exGender: exProfile?.gender === 'MALE' ? 'M' : 'F',
      birthDate: profile?.birthDate && `${dayjs().diff(profile?.birthDate, 'years')} / `,
      exBirthDate: exProfile?.birthDate && `${dayjs().diff(exProfile.birthDate, 'years')} / `,
      relationship:
        relationship?.cohabitationDate &&
        relationship?.separationDate &&
        dayjs(relationship.separationDate).diff(relationship.cohabitationDate, 'years'),
      address: profile?.city && profile?.residence && ` / ${address?.city}, ${address?.residence}`,
      exAddress:
        exAddress?.city && exAddress?.residence && ` / ${exAddress?.city}, ${exAddress?.residence}`,
    }),
    [profile, address, relationship, exAddress, exProfile, isPro, proProfile, avatar],
  );

  const showUpgradeBtn = useMemo(() => isOrgFounder || !isOrgMember, [isOrgMember, isOrgFounder]);

  const location = useLocation();

  const ClientDescription = useCallback(() => {
    if (!user?.client) return null;
    return (
      <ul className='list-inline pb-0 mb-0'>
        <li className='list-inline-item pr-1'>
          <span>{userData.birthDate}</span>
          <span>{userData.clientGender}</span>
          <span>{userData.address}</span>
          {userData.address && <span className='d-none d-md-inline'>{userData.address}</span>}
        </li>

        <li className='list-inline-item d-none d-sm-inline pr-1'>
          <FontAwesomeIcon
            icon={exProfile?.gender === 'MALE' ? 'male' : 'female'}
            className='mr-2 text-muted'
          />
          <span>{userData.exName}</span>
          <span>
            ({userData.exBirthDate}
            {userData.exGender}
            {userData.exAddress})
          </span>
        </li>

        <li className='list-inline-item d-none d-md-inline pr-1'>
          <FontAwesomeIcon icon='child' className='mr-1' />
          <span> {childrenLength} </span>
          <span>{childrenLength > 1 || childrenLength === 0 ? 'Children' : 'Child'}</span>
        </li>
        <li className='list-inline-item d-none d-md-inline'>
          <FontAwesomeIcon icon='heart' className='mr-2 text-muted' />
          <span>{userData.relationship || 0}</span>
          <span> Year Relationship</span>
        </li>
        {!location.pathname.includes('profile') && (
          <li className='list-inline-item d-none d-inline pr-1 pt-2 text-nowrap'>
            <FontAwesomeIcon icon='edit' className='mr-1' />
            <Link to='/profile/background'>
              <span>(edit)</span>
            </Link>
          </li>
        )}
      </ul>
    );
  }, [userData, childrenLength, exProfile, user, location.pathname]);

  const ProDescription = useCallback(() => {
    if (!isPro) return null;

    return (
      <ul className='list-inline pb-0 mb-0'>
        <li className='list-inline-item pr-1'>
          <FontAwesomeIcon icon='gavel' className='mr-2 text-muted' />
          <span className='text-capitalize'>{professional?.type.toLowerCase()} </span>
        </li>
        {professional.organization && (
          <li className='list-inline-item pr-1'>
            <FontAwesomeIcon icon='university' className='mr-2 text-muted' />
            <span>{professional.organization?.name} </span>
          </li>
        )}
        {professional.jurisdiction?.[0] && (
          <li className='list-inline-item pr-1'>
            <FontAwesomeIcon icon='flag' className='mr-2 text-muted' />
            <span>{professional.jurisdiction?.[0]?.jurisdiction} </span>
            <span>{professional.jurisdiction?.[0]?.year} </span>
          </li>
        )}
        {professional.degree?.[0] && (
          <li className='list-inline-item pr-1'>
            <FontAwesomeIcon icon='graduation-cap' className='mr-2 text-muted' />
            <span>{professional.degree?.[0]?.abbreviation} </span>
            <span>{professional.degree?.[0]?.institution} </span>
            <span>{professional.degree?.[0]?.year}</span>
          </li>
        )}
        {location.pathname !== '/profile' && (
          <li className='list-inline-item d-none d-inline pr-1 text-nowrap'>
            <FontAwesomeIcon icon='edit' className='mr-1' />
            <Link to='/profile'>
              <span>(edit)</span>
            </Link>
          </li>
        )}
      </ul>
    );
  }, [isPro, professional, location.pathname]);

  if (loading) return <Preloader />;

  if (error) {
    return <pre>{error.message}</pre>;
  }

  return (
    <div className='avatar-editor profile-header-container'>
      <div className='profile-header'>
        <div className='profile-header-description'>
          <div className='profile-description'>
            <AvatarSelector
              avatar={isPro ? userData.proAvatar : userData.avatar}
              isPro={isPro}
              id={userId}
            />
            <div className='description-container'>
              <h5 className='mb-0'>{userName}</h5>
              <div className='description'>
                <ProDescription />
                <ClientDescription />
              </div>
            </div>
          </div>
        </div>
        <div className='upgrade-btn'>{showUpgradeBtn && <ProfileUpgradeButton />}</div>
      </div>
    </div>
  );
};

export default ProfileHeader;
