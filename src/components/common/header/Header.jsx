import React, { useCallback, useEffect, useState, useMemo } from 'react';

import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { ButtonGroup, Row, Col } from 'reactstrap';
import classNames from 'classnames';

import ClientCalculatorsDropdown from 'components/common/header/ClientCalculatorsDropdown';
import ClientProfileProgress from 'components/common/header/ClientProfileProgress';
import ClientsCount from 'components/common/header/ClientsCount';
import Button from 'components/common/Button';

import ProfileBreadcrumb from 'components/breadcrumb/ProfileBreadcrumb';
import CalculatorBreadcrumb from 'components/breadcrumb/CalculatorBreadcrumb';

import useClientsCount from 'hooks/useClientsCount';
import usePathToProfile from 'hooks/usePathToProfile';
import useCurrentUser from 'hooks/useCurrentUser';

import CLIENT from 'graphql/queries/client/client';

const Header = ({ isProffessional: isProfessional, name, isClientHasName }) => {
  const [calculatorType, setCalculatorType] = useState();

  const { isActiveSub, isPro, isChildSpousalSub, me } = useCurrentUser();

  const history = useHistory();
  const { pathname } = useLocation();
  const match = useRouteMatch(
    calculatorType &&
      `/${
        calculatorType?.includes('Child') ? 'child-support' : 'spousal-support'
      }/:calculationId/:clientId`,
  );

  const profilePathMatch = useRouteMatch('/clients/:clientId/edit');

  const clientId = useMemo(() => {
    if (!isProfessional) return null;
    if (match?.params?.clientId === 'create') return match?.params?.calculationId;
    if (profilePathMatch?.params?.clientId) return profilePathMatch?.params?.clientId;

    return match?.params?.clientId;
  }, [isProfessional, match, profilePathMatch]);

  const pathToProfile = usePathToProfile();

  const { data: countData } = useClientsCount();
  const clientsCount = countData?.clientsCount?.counts[0] ?? 0;

  const { data } = useQuery(CLIENT, {
    variables: { where: { id: clientId } },
    skip: !clientId,
  });

  const handleClick = useCallback(
    ({ currentTarget }) => {
      const path = currentTarget.id;

      if (!me?.id) {
        history.push('/upgrade');
      } else if (isClientHasName || isProfessional) {
        history.push(path);
      } else if (path === '/plans') {
        history.push('/profile/settings');
      } else {
        history.push('/profile/billing');
      }
    },
    [history, isClientHasName, isProfessional, me],
  );

  const RightSide = useCallback(() => {
    if (typeof me?.id === 'string') {
      if (isProfessional) return <ClientsCount />;

      return <ClientProfileProgress />;
    }

    return null;
  }, [isProfessional, me.id]);

  const Description = useCallback(() => {
    if (calculatorType)
      return (
        <CalculatorBreadcrumb
          calculatorType={calculatorType.includes('Child') ? 'child' : 'spousal'}
          client={data}
          match={match}
        />
      );

    if (isProfessional && pathname.includes('/edit/')) {
      return <ProfileBreadcrumb client={data} />;
    }

    if (isProfessional)
      return (
        <span className='h6 mt-3 mb-0 text-white header-title-description'>
          {`You have ${clientsCount} active clients.`}
        </span>
      );

    return (
      <span className='text-light header-title-description'>
        This is
        <strong> your </strong>
        divorce path.
      </span>
    );
  }, [data, isProfessional, clientsCount, calculatorType, match, pathname]);

  const isShowUpgradeBtn = useMemo(
    () => (isPro && !isActiveSub) || (!isPro && !isChildSpousalSub),
    [isActiveSub, isPro, isChildSpousalSub],
  );

  useEffect(() => {
    if (pathname.includes('child-support')) return setCalculatorType('Child Support Calculator');
    if (pathname.includes('spousal-support'))
      return setCalculatorType('Spousal Support Calculator');

    return setCalculatorType(null);
  }, [pathname]);

  const clientName = useMemo(() => {
    const { firstName, lastName, email, id } = data?.client?.profile || {};

    if (firstName && lastName) return `${firstName} ${lastName}`;

    return firstName || lastName || email || id || null;
  }, [data]);

  return (
    <header className='header-account-page d-flex align-items-end client-header'>
      <div className='container'>
        <Row className='mb-5 mt-3 ml-0 user-info' noGutters>
          <Col xs={9}>
            <h1 className='h2 mb-0 text-white d-block'>
              {calculatorType || clientName || `Welcome, ${name}`}
            </h1>
            <Description />
          </Col>

          <Col className='d-none d-sm-block text-sm-center text-md-right'>
            <RightSide />
          </Col>
        </Row>
        <Row className='client-buttons'>
          <ButtonGroup>
            <ClientCalculatorsDropdown isPro />
            <Button
              size='lg'
              color='secondary'
              id='/'
              onClick={handleClick}
              leftIcon={isProfessional ? 'users' : 'home'}
              className={classNames({ active: pathname === '/' })}
            >
              {isProfessional ? 'Clients' : 'Home'}
            </Button>
            {/* if it is public calc, hide the button */}
            {me?.id && (
              <Button
                id={isProfessional ? '/profile/organization' : pathToProfile}
                size='lg'
                onClick={handleClick}
                color='secondary'
                leftIcon={isProfessional ? 'office' : 'edit'}
                className={classNames({
                  active: pathname === '/profile/organization' || pathname.includes('/profile/'),
                })}
              >
                {isProfessional ? 'Team' : 'Profile'}
              </Button>
            )}
            {isShowUpgradeBtn && (
              <Button
                id='/plans'
                size='lg'
                color='secondary'
                onClick={handleClick}
                leftIcon='arrow-circle-up'
                className={classNames({
                  active: pathname.includes('/plans') || pathname.includes('/upgrade'),
                })}
              >
                Upgrade
              </Button>
            )}
          </ButtonGroup>
        </Row>
      </div>
    </header>
  );
};

export default Header;
