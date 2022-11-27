/* eslint-disable no-shadow */
import React, { useCallback, useMemo } from 'react';

import { useQuery } from '@apollo/client';
import { Switch, useParams, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, CardHeader, ListGroup } from 'reactstrap';

import Loading from 'components/common/Loading';
import SidebarItem from 'components/common/sidebar/SidebarItem';

import ProfileHeader from 'components/ClientProfile/ProfileHeader';
import ClientProfileRoutes from 'components/ClientProfile/ClientProfileRoutes';

import useCurrentUser from 'hooks/useCurrentUser';
import useUpdateUser from 'hooks/useUpdateUser';

import customGet from 'utils/get';
import getCompleteProfilePercent from 'utils/getCompleteProfilePercent';

import CLIENT from 'graphql/queries/client/client';

import { clientSidebarOptions, proSidebarOptions, clientActions } from './sidebarOptions';

const paths = {
  child: '/child-support',
  spousal: '/spousal-support',
};

const ClientProfile = () => {
  const location = useLocation();
  const { clientId } = useParams();

  const { me, isPro } = useCurrentUser();

  const variables = useMemo(() => ({ where: { id: clientId || me.id } }), [clientId, me.id]);
  const refetchQuery = useMemo(
    () => (clientId ? { query: CLIENT, variables } : {}),
    [clientId, variables],
  );
  const updateUser = useUpdateUser({ refetchQuery });
  const { data, loading } = useQuery(CLIENT, { variables, skip: !clientId });

  const type = useMemo(
    () => (location.pathname.includes('clients') ? 'client' : 'user'),
    [location],
  );

  const user = useMemo(() => (type === 'user' ? me : data), [data, me, type]);
  const isClient = useMemo(() => me?.client?.id, [me]);
  const sidebarOptions = useMemo(
    () => (isClient ? clientSidebarOptions : proSidebarOptions),
    [isClient],
  );
  const pathname = useMemo(
    () => (type === 'user' ? '/profile' : `/clients/:clientId/edit`),
    [type],
  );
  const pathnameLink = useMemo(
    () => (type === 'user' ? '/profile' : `/clients/${clientId}/edit`),
    [type, clientId],
  );

  const profileProgress = useMemo(
    () => (type === 'client' ? data?.client?.profileProgress : me.client?.profileProgress),
    [type, me, data],
  );

  const completeProfilePercent = useMemo(
    () => getCompleteProfilePercent(profileProgress),
    [profileProgress],
  );

  const ClientActions = useCallback(
    () => (
      <Card className='profile-sidebar'>
        <CardHeader>
          <h6>
            {type === 'user' ? '' : 'Client '}
            Actions
          </h6>
        </CardHeader>
        <ListGroup>
          {clientActions.map(({ type, label, icon, accountType }) => {
            if (accountType === 'pro' && !isPro) return null;

            return (
              <SidebarItem
                key={label}
                pathname={`${paths[type]}${clientId ? `/${clientId}/create` : ''}`}
                label={label}
                icon={icon}
                activeClass='unused'
              />
            );
          })}
        </ListGroup>
      </Card>
    ),
    [type, clientId, isPro],
  );

  if (loading)
    return (
      <main className='user-profile'>
        <Container>
          <Row className='justify-content-center'>
            <Loading />
          </Row>
        </Container>
      </main>
    );

  return (
    <div className='pro-user-profile user-profile'>
      <Container>
        <Row>
          <Col lg={3}>
            {type === 'user' && (
              <Card className='profile-sidebar'>
                <CardHeader>
                  <h6>Account</h6>
                </CardHeader>
                <ListGroup>
                  <SidebarItem
                    pathname={`${pathnameLink}/billing`}
                    label='Billing'
                    icon='credit-card'
                  />
                  <SidebarItem
                    pathname={`${pathnameLink}/settings`}
                    label='Settings'
                    icon='settings'
                  />
                </ListGroup>
              </Card>
            )}

            <Card className='profile-sidebar'>
              <CardHeader>
                <h6>{`${type === 'user' ? 'Your' : 'Client'} Profile${
                  completeProfilePercent > 100 ? ' 100%' : ` ${completeProfilePercent}%`
                }`}</h6>
              </CardHeader>
              <ListGroup>
                {sidebarOptions.map(option => (
                  <SidebarItem
                    key={option.type}
                    pathname={`${pathnameLink}/${option.type}`}
                    label={option.label}
                    icon={option.icon}
                    status={customGet(profileProgress, option.type, '')}
                  />
                ))}
              </ListGroup>
            </Card>

            <ClientActions />
          </Col>

          <Col lg={9}>
            {type === 'user' && <ProfileHeader />}

            <Switch>
              <ClientProfileRoutes
                isClient={isClient}
                pathname={pathname}
                pathnameLink={pathnameLink}
                updateUser={updateUser}
                user={user}
              />
            </Switch>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ClientProfile;
