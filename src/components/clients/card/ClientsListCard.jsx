import React, { useMemo, useState, useCallback, useEffect } from 'react';

import classnames from 'classnames';
import { ListGroup, ListGroupItem, Collapse } from 'reactstrap';

import ClientButtonsContainer from 'components/clients/ClientButtonsContainer';
import ClientCardHeader from 'components/clients/card/ClientCardHeader';
import ProfileDetails from 'components/clients/card/ProfileDetails';
import ClientCardCalculations from 'components/clients/card/ClientCardCalculations';
import ClientCardInterviews from 'components/clients/card/ClientCardInterviews';

import TabNavigation from './TabNavigation';
import ClientIntake from './ClientIntake';

const ClientsListCard = ({ client, expandedClient, setExpandedClient, defaultClosed }) => {
  const [tab, setTab] = useState(1);

  const { id, children, type } = useMemo(() => client, [client]);

  const isPotential = useMemo(() => type === 'POTENTIAL', [type]);

  const [isOpen, setIsOpen] = useState((expandedClient || isPotential) && !defaultClosed);

  useEffect(() => {
    if (defaultClosed && !expandedClient) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [defaultClosed, expandedClient]);

  const toggle = useCallback(() => {
    setExpandedClient();
    setIsOpen(prev => !prev);
  }, [setExpandedClient]);

  return (
    <ListGroup className='clients-list'>
      <ListGroupItem className={classnames('mb-3 hover-shadow-sm', { opened: isOpen })}>
        <ClientCardHeader client={client} expandedClient={isOpen} setExpandedClient={toggle} />
        <Collapse className='client-info-content' isOpen={isOpen}>
          <div className='client-info'>
            <TabNavigation client={client} tab={tab} setTab={setTab} />

            <ClientIntake
              isShow={tab === 1}
              client={client}
              setExpandedClient={setExpandedClient}
            />

            <ProfileDetails
              isShow={tab === 2}
              client={client}
              setExpandedClient={setExpandedClient}
            />

            <ClientCardCalculations isShow={tab === 3} clientId={id} client={client} />

            <ClientCardInterviews isShow={tab === 4} client={client} />

            <ClientButtonsContainer clientId={id} client={client} clientChildren={children} />
          </div>
        </Collapse>
      </ListGroupItem>
    </ListGroup>
  );
};

export default ClientsListCard;
