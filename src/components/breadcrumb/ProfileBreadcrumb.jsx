import React, { useMemo } from 'react';

import { Link, useLocation } from 'react-router-dom';

const ProfileBreadcrumb = () => {
  const { pathname } = useLocation();

  const links = useMemo(
    () => [
      { name: 'Clients', link: '/' },
      { name: 'Edit Client Profile', link: pathname },
    ],
    [pathname],
  );

  return (
    <div className='breadcrumb custom-breadcrumb'>
      {links.map(link => (
        <div key={link.name} className='breadcrumb-item'>
          <Link to={link.link}>{link.name}</Link>
        </div>
      ))}
    </div>
  );
};

export default ProfileBreadcrumb;
