import React, { useMemo, useCallback, Fragment, useEffect, useRef, useState } from 'react';

import { useQuery } from '@apollo/client';
import { Card, Row } from 'reactstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import last from 'lodash/last';
import uniqBy from 'lodash/uniqBy';
import debounce from 'lodash/debounce';
import { scroller } from 'react-scroll';

import Button from 'components/common/Button';
import Loading from 'components/common/Loading';
import CalculationsTypeDropdown from 'components/common/CalculationsTypeDropdown';
import UpdateClientIntakeModal from 'components/modals/client/UpdateClientIntakeModal';
import CreateInterviewModal from 'components/modals/interview/CreateInterviewModal';
import MergeConflictFieldModal from 'components/modals/interview/MergeConflictFieldModal';
import DeleteInterviewModal from 'components/modals/interview/DeleteInterviewModal';

import ClientsListCard from 'components/clients/card/ClientsListCard';

import useCurrentUser from 'hooks/useCurrentUser';
import useWindowSize from 'hooks/useWindowSize';

import { applyFilterToQuery, filters } from 'helpers/filters';

import getUserName from 'utils/getUserName';
import generateClientsQuery from 'utils/generateClientsQuery';

import CLIENTS from 'graphql/queries/client/paginatedClients';

// In the client card there is a function to write to the local storage data about
// the state of open/not open client profile collapse, the code below is used to protect
// against local storage overflow. This line length is designed for about 1k client profile open/closed entries.
// the maximum string length in most browsers is about 5 million characters
const detailsOpenLength = localStorage.getItem('detailsOpen')?.length;
if (detailsOpenLength > 38000) localStorage.setItem('detailsOpen', JSON.stringify({}));

const LIMIT = 10;

const getExtendedClientFromLS = id =>
  JSON.parse(localStorage.getItem('detailsOpen'))?.[id]?.profileOpenLS;

const ClientsListContainer = ({
  searchValue,
  searchFilter,
  resetSearchValue,
  expandedClient,
  setExpandedClient,
  setDebounceLoading,
}) => {
  const { me, isPro } = useCurrentUser();
  const intervalRef = useRef();
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('');
  const [actualClients, setActualClients] = useState([]);
  const [isScrolledToPotential, setIsScrolledToPotential] = useState(false);

  const { isMobileView } = useWindowSize();

  const defaultClosedCard = useMemo(
    () => searchFilter !== filters.POTENTIAL_CLIENTS,
    [searchFilter],
  );

  const userName = useMemo(() => getUserName(me), [me]);
  const {
    professional: { id: professionalId },
  } = me;

  const variables = useMemo(() => {
    const rawVariables = {
      first: LIMIT,
      orderBy: [{ type: 'asc' }, { createdAt: 'desc' }],
    };

    if (debouncedSearchValue) {
      rawVariables.where = generateClientsQuery(debouncedSearchValue, [
        'firstName',
        'middleName',
        'lastName',
      ]);

      return rawVariables;
    }

    rawVariables.where = applyFilterToQuery(searchFilter, { id: professionalId })({
      NOT: { type: { equals: 'NOT_RETAINED' } },
    });

    return rawVariables;
  }, [debouncedSearchValue, searchFilter, professionalId]);

  const { data, loading, fetchMore, refetch } = useQuery(CLIENTS, {
    variables,
    skip: !isPro,
  });

  const handleLoadMore = useCallback(async () => {
    if (!loading) {
      try {
        const queryResult = await fetchMore({
          variables: { ...variables, after: { id: last(data?.paginatedClients?.nodes)?.id } },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;

            const { paginatedClients: prevClients = [] } = prev;
            const { paginatedClients: newClients = [] } = fetchMoreResult;

            return {
              paginatedClients: {
                ...fetchMoreResult?.paginatedClients,
                nodes: uniqBy([...(prevClients?.nodes || []), ...(newClients?.nodes || [])], 'id'),
              },
            };
          },
        });

        const currentClients = queryResult?.data?.paginatedClients?.nodes;

        if (currentClients) setActualClients({ ...data.paginatedClients.nodes, ...currentClients });
      } catch (err) {}
    }
  }, [fetchMore, loading, data, variables]);

  const handleDebouncedSearchValueChange = useCallback(value => setDebouncedSearchValue(value), []);

  const debouncedChangeHandler = useMemo(
    () => debounce(handleDebouncedSearchValueChange, 500),
    [handleDebouncedSearchValueChange],
  );

  useEffect(() => {
    if (data) {
      setActualClients(data?.paginatedClients?.nodes);
    }
  }, [data]);

  useEffect(() => {
    intervalRef.current = setInterval(refetch, 300000);

    return () => clearInterval(intervalRef.current);
  }, [refetch]);

  useEffect(() => {
    debouncedChangeHandler(searchValue);

    if (!searchValue) {
      debouncedChangeHandler.cancel();
      setDebouncedSearchValue('');
    }
  }, [debouncedChangeHandler, searchValue]);

  useEffect(() => {
    setDebounceLoading(false);
  }, [actualClients, setDebounceLoading]);

  useEffect(() => {
    if (debouncedSearchValue === searchValue) setTimeout(() => setDebounceLoading(false), 0);
  }, [debouncedSearchValue, searchValue, setDebounceLoading]);

  useEffect(() => {
    if (
      data?.paginatedClients?.nodes[0]?.type === 'POTENTIAL' &&
      !isScrolledToPotential &&
      isMobileView
    ) {
      setTimeout(() => {
        scroller.scrollTo('POTENTIAL', {
          duration: 500,
          smooth: 'easeInOutQuart',
          offset: -30,
        });
      }, 500);

      setIsScrolledToPotential(true);
    }
  }, [data, expandedClient, isMobileView, isScrolledToPotential]);

  useEffect(() => {
    if (data && data.paginatedClients?.nodes[0]?.type !== 'POTENTIAL') {
      const clientId = localStorage.getItem('profileOpen');

      if (clientId) {
        setTimeout(
          () =>
            scroller.scrollTo(clientId, {
              duration: 700,
              smooth: 'easeInOutQuart',
              offset: -20,
            }),
          200,
        );
      }
    }
  }, [data]);

  if (loading && !actualClients.length)
    return (
      <Row className='justify-content-center'>
        <Loading />
      </Row>
    );

  return (
    <Fragment>
      {!!actualClients?.length && (
        <InfiniteScroll
          next={handleLoadMore}
          hasMore={data?.paginatedClients?.hasNextPage}
          dataLength={actualClients.length}
          loader={<Loading />}
          scrollThreshold='1000px'
          className='infinite-scroll-container'
        >
          {actualClients?.map(client => (
            <ClientsListCard
              key={client?.id}
              client={client}
              expandedClient={expandedClient === client.id || getExtendedClientFromLS(client?.id)}
              setExpandedClient={setExpandedClient}
              defaultClosed={defaultClosedCard}
            />
          ))}
        </InfiniteScroll>
      )}

      {!actualClients?.length &&
        (searchValue ? (
          <Card className='no-result-clients-list mb-2 mx-3 '>
            <img alt='icon' src='./img/icons/dusk/svg/find-and-replace.svg' className='mb-3' />
            Not who you’re looking for?
            <Button className='mt-2' onClick={resetSearchValue}>
              Click to view all clients
            </Button>
          </Card>
        ) : (
          <Card className='no-result-clients-list mb-2 mx-3 '>
            <h4 className='mb-4'>Welcome to Divorcepath Pro Tools, {userName}.</h4>
            <div className='text-justify pro-tools-card'>
              <p className='text-justify'>
                Divorcepath Pro Tools helps you manage client profile information and calculate
                support for clients quickly and easily.
              </p>
              <p>There are two ways to create new client profiles in Divorcepath:</p>
              <ul>
                <li>click the "Add Client" button above to create your first client, or</li>
                <li>
                  click the the "New Calculation" button below, and save the calculation to a new
                  client.
                </li>
              </ul>
              <p>
                Once you've created a client, your clients will be listed on this page and you'll be
                able to quickly view their profile information and create support calculations for
                them.
              </p>
              <p>
                For more actions or help getting started, check out the links in the sidebar or
                visit the
                <a href='https://www.divorcepath.com/help'> help centre.</a>
              </p>
            </div>
            <hr className='pt-0 pb-0 mt-0 mb-3' />

            <div className='d-flex justify-content-start'>
              <CalculationsTypeDropdown
                size='sm'
                headerMenuLabel='Calculations'
                client={isPro ? null : me?.client?.children}
              />
            </div>
          </Card>
        ))}

      <UpdateClientIntakeModal />
      <CreateInterviewModal />
      <MergeConflictFieldModal />
      <DeleteInterviewModal />
    </Fragment>
  );
};

export default ClientsListContainer;
