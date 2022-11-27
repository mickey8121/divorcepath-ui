import React from 'react';

import { Container, CardDeck, Col } from 'reactstrap';

import Sidebar from 'components/common/Sidebar';

import CalculationsCard from 'components/AccountOverview/client/CalculationsCard';
import ConfirmEmailAlert from 'components/AccountOverview/client/ConfirmEmailAlert';
import ProfileCard from 'components/AccountOverview/client/ProfileCard';

import useCurrentUser from 'hooks/useCurrentUser';

import sections from 'helpers/sidebarSections/clientSections';

const AccountOverview = () => {
  const { me } = useCurrentUser();

  return (
    <main className='home-page-content'>
      <Container>
        <ConfirmEmailAlert />
        <CardDeck className='flex-column flex-lg-row client-overview'>
          <Col lg={8} className='p-0 px-sm-2 px-md-4'>
            <ProfileCard />
            <CalculationsCard calculationsClient='Your' clientId={me?.client?.id} />
          </Col>
          <Col lg={4}>
            <Sidebar sections={sections} title='Settings' />
          </Col>
        </CardDeck>
      </Container>
    </main>
  );
};

export default AccountOverview;
