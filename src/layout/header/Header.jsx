/* eslint-disable arrow-body-style */
import React, { useMemo } from 'react';

import { Link, useLocation } from 'react-router-dom';

import PublicHeader from 'layout/header/PublicHeader';
import AuthenticatedHeader from 'layout/header/AuthenticatedHeader';

import HeaderContainer from 'components/common/header/HeaderContainer';

import useCurrentUser from 'hooks/useCurrentUser';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const hideHeaderRoutes = [
  '/sign-in',
  '/upgrade',
  '/sign-up',
  '/complete-account',
  '/confirm-account',
  '/reset-password',
  '/recover-password',
  '/organization/invite',
  '/subscription',
];

const Header = () => {
  const { pathname } = useLocation();
  const { me } = useCurrentUser();

  const paths = useMemo(() => {
    // if you wish hide the header for public calculator pages
    // if (!me.id) {
    //   return [...hideHeaderRoutes, '/child-support', '/spousal-support'];
    // }

    return hideHeaderRoutes;
  }, []);

  const isHide = useMemo(
    () => paths.map(path => pathname.includes(path) && pathname !== '/').includes(true),
    [paths, pathname],
  );

  const homeURL = useMemo(() => {
    // true is a string here, it is not a mistake
    if (process.env.REACT_APP_LOCAL === 'true') {
      return 'http://localhost:3000';
    }
    return 'https://www.divorcepath.com';
  }, []);

  return (
    <div className='header-container feature-cover'>
      <header className='header-transparent' id='header-main'>
        <div id='navbar-top-main' className='navbar-top  navbar-dark border-bottom'>
          <div className='container pr-0'>
            <div className='navbar-nav align-items-center'>
              <div className='d-none d-lg-inline-block'>
                <span className='navbar-text mr-3'>
                  <a href={homeURL}>Divorcepath.com - online divorce</a>
                </span>
              </div>
              <div>
                <ul className='nav'>
                  <li className='nav-item dropdown ml-lg-2 dropdown-animate' data-toggle='hover'>
                    <Link className='nav-link px-0' to='/'>
                      <img
                        alt='Canadian Flag'
                        style={{ width: '20px', height: '14px' }}
                        src='./img/icons/flags/ca.svg'
                      />
                      <span className='d-none d-lg-inline-block'>Canada - English</span>
                      <span className='d-lg-none'>EN</span>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className='ml-auto'>
                <ul className='nav'>
                  <ul className='navbar-nav align-items-lg-center ml-lg-auto'>
                    <li className='nav-item'>
                      <a className='nav-link' href='https://www.divorcepath.com/help'>
                        <FontAwesomeIcon icon='book' className='mr-2' />
                        Help Centre
                      </a>
                    </li>
                  </ul>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <nav className='navbar navbar-main navbar-expand-lg navbar-transparent' id='navbar-main'>
          <div className='container pr-0'>
            <a href={homeURL} className='navbar-brand mr-0 mr-lg-5'>
              <img
                alt='Divorcepath.com - online divorce'
                src='./img/brand/divorcepath-white.svg'
                style={{ width: '180px', height: '50px' }}
                className='placeholderImg'
              />
            </a>
            <div>{me?.id ? <AuthenticatedHeader /> : <PublicHeader />}</div>
          </div>
        </nav>
      </header>
      {!isHide && <HeaderContainer />}
    </div>
  );
};

export default Header;
