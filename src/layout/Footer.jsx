/* eslint-disable react/jsx-one-expression-per-line */
import React, { useMemo } from 'react';

import { Link } from 'react-router-dom';
import { Row, Col, Button as BSButton } from 'reactstrap';

import usePathToProfile from 'hooks/usePathToProfile';
import useCurrentUser from 'hooks/useCurrentUser';

import footerLinks from 'helpers/data/footerLinks';

import customGet from 'utils/get';

const copyrightStartYear = 2019;
const companyName = 'Divorcepath Corp.';
const missionStatement =
  'Our mission to simplify the divorce process. We make spousal support and child support calculators used by family law professionals and families across Canada.';

const copyrightYear = () => {
  const currentYear = new Date().getFullYear();
  return currentYear === copyrightStartYear
    ? copyrightStartYear
    : `${copyrightStartYear}-${currentYear}`;
};

const Footer = () => {
  const { me, isOrgMember } = useCurrentUser();
  const pathToProfile = usePathToProfile();

  const isPro = useMemo(() => customGet(me, 'professional', false) !== false, [me]);
  const planId = useMemo(() => customGet(me, 'subscription.plan.id', false), [me]);

  const { ctaHeading, ctaBody, ctaButton, ctaLink } = useMemo(() => {
    if (isPro && planId === 'FIRM') {
      return {
        ctaHeading: 'Access for Everyone',
        ctaBody: 'Add unlimited users to your organization within your existing plan.',
        ctaButton: 'Add Users',
        ctaLink: '/profile/organization',
      };
    }

    if (isOrgMember) {
      return {
        ctaHeading: 'Discover Pro Tools',
        ctaBody: 'Learn how to use Divorcepath Pro Tools.',
        ctaButton: 'Start Now',
        ctaLink: '/',
      };
    }

    if (planId === 'CHILD_SUPPORT_1') {
      return {
        ctaHeading: 'Upgrade to Calculate Spousal Support',
        ctaBody:
          'Calculate spousal support and generate courtroom-ready reports for less than the cost of a lawyer consultation.',
        ctaButton: 'Upgrade Now',
        ctaLink: '/plans',
      };
    }

    if (planId === 'CHILD_SPOUSAL_SUPPORT_1') {
      return {
        ctaHeading: 'Find your path.',
        ctaBody:
          'Learn more about child support and spousal support in the Divorcepath help centre.',
        ctaButton: 'Help Centre',
        ctaLink: 'https://www.divorcepath.com/help',
      };
    }

    return {
      ctaHeading: 'Find your path.',
      ctaBody:
        'Upgrade for courtroom-ready child support & spousal support reports, plus premium calculator features.',
      ctaButton: 'Upgrade Now',
      ctaLink: me?.id ? '/plans' : '/upgrade',
    };
  }, [isPro, planId, isOrgMember, me]);

  return (
    <React.Fragment>
      <div className='footer-cta'>
        <h2>{ctaHeading}</h2>
        <p>{ctaBody}</p>
        <Link to={ctaLink}>
          <BSButton type='button' color='primary' className='custom-button'>
            {ctaButton}
          </BSButton>
        </Link>
      </div>
      <div className='footer'>
        <Row className='mb-5'>
          <Col md={5} lg={4}>
            <Link className='navbar-brand mr-5 mb-2' to='/'>
              <img
                alt='Divorcepath.com - online divorce'
                src='./img/brand/divorcepath-blue.svg'
                style={{ width: '280px' }}
                className='placeholderImg'
              />
            </Link>
            <p className='mr-4 mb-5'>{missionStatement}</p>
          </Col>
          <Col md={7} lg={8}>
            <Row>
              {footerLinks.map(({ links, name: sectionName }) => (
                <Col md={6} lg={3} key={sectionName}>
                  <h6>{sectionName}</h6>
                  <ul>
                    {links.map(({ name, href, noExternal }) => (
                      <li key={name}>
                        {noExternal && <Link to={pathToProfile}>{name}</Link>}
                        {!noExternal && <a href={href}>{name}</a>}
                      </li>
                    ))}
                  </ul>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
        <Row className='show-grid justify-content-between'>
          <p className='pull-left'>
            &copy; {copyrightYear()} {companyName}
          </p>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default Footer;
