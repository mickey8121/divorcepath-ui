import React, { useMemo } from 'react';

import { Route, Switch } from 'react-router-dom';
import { Container, Row, Col, Card, CardHeader, ListGroup } from 'reactstrap';

import SidebarItem from 'components/common/sidebar/SidebarItem';

import Profile from 'components/ProProfile/Profile';
import SettingsForm from 'components/ClientProfile/settingsForm/SettingsForm';
import ChooseBillingPlan from 'components/billing/ChooseBillingPlan';
import Organization from 'components/organization/Organization';
import IntakeAdminPanel from 'components/organization/intake/IntakeAdminPanel';

import useCurrentUser from 'hooks/useCurrentUser';

const ProProfilePage = () => {
  const { isOrgFounder, isIntakeAdminVisible } = useCurrentUser();

  const sidebarOptions = useMemo(
    () => [
      {
        exact: true,
        type: '',
        icon: 'user-circle',
        label: 'Your Profile',
      },
      {
        type: '/organization',
        icon: 'office',
        label: 'Your Organization',
      },
      {
        type: '/client-intake',
        icon: 'config',
        label: 'Client Intake',
        hidden: !isIntakeAdminVisible,
      },
      {
        type: '/billing',
        icon: 'credit-card',
        label: 'Billing',
      },
      {
        type: '/settings',
        icon: 'settings',
        label: 'Account Settings',
      },
    ],
    [isIntakeAdminVisible],
  );

  return (
    <div className='pro-user-profile'>
      <Container>
        <Row className='row-grid'>
          <Col lg={3}>
            <Card className='profile-sidebar'>
              <CardHeader>
                <h6>Settings</h6>
              </CardHeader>
              <ListGroup>
                {(isOrgFounder
                  ? sidebarOptions
                  : sidebarOptions.filter(({ type }) => type !== '/billing')
                ).map(({ type, icon, label, exact, disabled, hidden }) => (
                  <SidebarItem
                    key={type}
                    pathname={`/profile${type}`}
                    label={label}
                    icon={icon}
                    exact={exact}
                    disabled={disabled}
                    hidden={hidden}
                  />
                ))}
              </ListGroup>
            </Card>
          </Col>
          <Col lg={9} className='mb-4 mt-0'>
            <Switch>
              <Route exact path='/profile' component={Profile} />
              <Route exact path='/profile/settings' component={SettingsForm} />
              <Route exact path='/profile/billing' component={ChooseBillingPlan} />
              <Route exact path='/profile/organization' component={Organization} />
              <Route exact path='/profile/client-intake' component={IntakeAdminPanel} />
            </Switch>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProProfilePage;
