import React from 'react';

import { Link } from 'react-router-dom';

import useClientsCount from 'hooks/useClientsCount';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ClientsCount = () => {
  const { data } = useClientsCount();
  const clientsCount = data?.clientsCount?.counts[0] ?? 0;

  return (
    <Link to='/' className='clients-count text-decoration-none'>
      <span className='badge badge-dot text-white'>
        <i className='bg-green' />
        Your clients
      </span>

      <span className='d-block h3 text-white font-weight-bold pl-3' href='#'>
        {clientsCount}
        &nbsp;
        <FontAwesomeIcon icon='chart-line' />
      </span>
    </Link>
  );
};

export default ClientsCount;
