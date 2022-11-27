import React, { useState, useCallback, useEffect, useMemo } from 'react';

import { Link } from 'react-router-dom';
import { Container, Col, CardDeck } from 'reactstrap';
import { usePrevious } from 'react-delta';
import { scroller } from 'react-scroll';

import Sidebar from 'components/common/Sidebar';
import CreateNewClientModal from 'components/modals/client/CreateNewClientModal';
import Notification from 'components/common/Notification';

import ClientsListContainer from 'components/clients/ClientsListContainer';
import ClientsSearch from 'components/clients/ClientsSearch';
import ClientsSearchFilters from 'components/clients/ClientsSearchFilters';
import NewClientContainer from 'components/clients/NewClientContainer';
import SharedCalculationNotifications from 'components/clients/SharedCalculationNotifications';

import useCurrentUser from 'hooks/useCurrentUser';

import sections from 'helpers/sidebarSections/proSections';
import { filters } from 'helpers/filters';

const DEFAULT_FILTER = localStorage.getItem('searchFilter') || filters.YOUR_CLIENTS;

const AccountOverviewPro = () => {
  const [debounceLoading, setDebounceLoading] = useState(false);
  const [toggleForm, setToggleForm] = useState(false);
  const [searchValue, setSearchValue] = useState(localStorage.getItem('searchValue') || '');
  const [searchFilter, setSearchFilter] = useState(DEFAULT_FILTER);
  const [expandedClient, setExpandedClient] = useState(localStorage.getItem('profileOpen'));

  const { isOrgAdmin } = useCurrentUser();

  const prevSearch = usePrevious(searchValue);
  const prevFilter = usePrevious(searchFilter);

  const toggle = useCallback(() => setToggleForm(prev => !prev), []);

  const resetSearchValue = useCallback(() => {
    localStorage.setItem('searchValue', '');

    setSearchValue('');
  }, []);

  const isPotential = useMemo(() => searchFilter === filters.POTENTIAL_CLIENTS, [searchFilter]);

  const handleSetExpandedClient = useCallback(value => {
    if (value) {
      setTimeout(() => {
        scroller.scrollTo(value, {
          duration: 400,
          delay: 0,
          smooth: 'easeInOutQuart',
          ignoreCancelEvents: true,
          isDynamic: true,
          offset: -10,
        });
      }, 650);
    }

    setExpandedClient(value);
  }, []);

  const handleSetSearchValue = useCallback(value => {
    localStorage.setItem('searchValue', value);

    setSearchValue(value);
  }, []);

  const handleFilterChanged = useCallback(value => {
    localStorage.setItem('searchFilter', value);

    setTimeout(() => setSearchFilter(value), 0);
  }, []);

  useEffect(() => {
    if (searchValue !== prevSearch && typeof prevSearch === 'string') setDebounceLoading(true);

    if (!searchValue) setDebounceLoading(false);
  }, [prevSearch, searchValue, setDebounceLoading]);

  useEffect(() => {
    if (searchFilter !== prevFilter) setDebounceLoading(true);
  }, [searchFilter, prevFilter]);

  return (
    <main className='home-page-content'>
      <Container>
        <CardDeck className='flex-column flex-lg-row pt-4 pt-sm-2'>
          <Col lg={8} className='p-0 p-sm-2 p-md-4'>
            <CreateNewClientModal />

            <ClientsSearch
              onChange={handleSetSearchValue}
              searchValue={searchValue}
              setToggleForm={toggle}
              toggleForm={toggleForm}
              debounceLoading={debounceLoading}
            />

            <NewClientContainer
              setToggleForm={toggle}
              toggleForm={toggleForm}
              setExpandedClient={handleSetExpandedClient}
              handleSetSearchValue={handleSetSearchValue}
            />

            <ClientsSearchFilters
              filter={searchValue ? filters.ALL_FIRM_CLIENTS : searchFilter}
              disabled={!!searchValue}
              onChange={handleFilterChanged}
              defaultFilter={DEFAULT_FILTER}
            />

            {isPotential && isOrgAdmin && (
              <Notification
                body={
                  <p>
                    Add an&nbsp;
                    <Link className='intake-form-link' to='profile/client-intake'>
                      intake form
                    </Link>{' '}
                    to&nbsp;your website to&nbsp;automatically add potential new clients
                    to&nbsp;Divorcepath, with email notifications.
                  </p>
                }
                name='showIntakeNoty'
                containerClassName='mx-3'
                className='p-4'
                footer
              />
            )}

            <SharedCalculationNotifications />

            <ClientsListContainer
              searchValue={searchValue}
              searchFilter={searchFilter}
              resetSearchValue={resetSearchValue}
              setExpandedClient={handleSetExpandedClient}
              expandedClient={expandedClient}
              setDebounceLoading={setDebounceLoading}
            />
          </Col>

          <Col lg={4}>
            <Sidebar title='Pro Tools' sections={sections} />
          </Col>
        </CardDeck>
      </Container>
    </main>
  );
};

export default AccountOverviewPro;
