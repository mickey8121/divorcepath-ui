import React from 'react';

import { Link } from 'react-router-dom';

import Button from 'components/common/Button';

import useWindowSize from 'hooks/useWindowSize';

const PublicHeader = () => {
  const { width } = useWindowSize();

  return (
    <ul className='navbar-nav align-items-lg-center ml-lg-auto'>
      <li className='nav-item mr-3'>
        <Button
          tag={Link}
          to='/sign-in'
          color='white-link'
          className='mr-3 d-none d-lg-inline-flex'
        >
          Log In
        </Button>
      </li>
      <li className='nav-item mr-0'>
        <Button
          size={width < 525 ? 'sm' : 'md'}
          tag={Link}
          to='/sign-up'
          color='white'
          leftIcon='add-person'
        >
          Sign Up
        </Button>
      </li>
    </ul>
  );
};

export default PublicHeader;
