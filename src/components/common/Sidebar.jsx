import React from 'react';

import { Link } from 'react-router-dom';
import { CardLink } from 'reactstrap';
import classNames from 'classnames';

import Icon from 'components/common/Icon';

import useCurrentUser from 'hooks/useCurrentUser';

const Sidebar = ({ title, sections }) => {
  const { isOrgFounder, isPro } = useCurrentUser();

  return (
    <div className={classNames('links-sidebar', { 'mt-4': isPro })}>
      {title && (
        <div className='sidebar-header'>
          <h5 className='title'>{title}</h5>
        </div>
      )}
      {sections.map(({ title, links, headerIcon }) => (
        <div className='sidebar-section' key={title}>
          <h6 className='section-title'>
            <Icon name={headerIcon} /> {title}
          </h6>
          <div className='section-links'>
            {links.map(({ to, href, label, customId, hideForMembers }) => {
              if (hideForMembers && !isOrgFounder) return null;
              if (to) {
                return (
                  <Link to={{ pathname: to, state: { fromClientList: true } }} key={label}>
                    {label}
                  </Link>
                );
              }

              return (
                <CardLink
                  key={label}
                  href={href}
                  target='_blank'
                  rel='noopener noreferrer'
                  id={customId}
                >
                  {label}
                </CardLink>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
