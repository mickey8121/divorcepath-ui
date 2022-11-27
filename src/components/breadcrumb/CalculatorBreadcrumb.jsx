import React, { useMemo } from 'react';

import { Link, useLocation } from 'react-router-dom';

import useCurrentUser from 'hooks/useCurrentUser';

const types = {
  child: {
    name: 'Child Support Calculator',
    path: 'child-support',
  },
  spousal: {
    name: 'Spousal Support Calculator',
    path: 'spousal-support',
  },
};

const CalculatorBreadcrumb = ({ match, client, calculatorType }) => {
  const { me } = useCurrentUser();
  const isClient = useMemo(() => !!me.client?.id, [me]);

  const type = useMemo(() => types[calculatorType], [calculatorType]);

  const { pathname } = useLocation();

  const clientId = useMemo(() => {
    if (isClient) return null;
    if (match?.params?.clientId === 'create') return match?.params?.calculationId;

    return match?.params?.clientId;
  }, [isClient, match]);

  const links = useMemo(() => {
    const initialLinks = [
      { name: 'Home', link: '/' },
      {
        name: type.name,
        link: pathname,
      },
    ];

    if (!isClient && clientId) {
      const { firstName, email, id } = client?.client?.profile || {};
      const clientName = firstName || email || id || '...';

      return [...initialLinks, { name: clientName }];
    }
    return initialLinks;
  }, [type, isClient, clientId, client, pathname]);

  return (
    <div className='breadcrumb custom-breadcrumb'>
      {links.map(link => (
        <div key={link.name} className='breadcrumb-item'>
          {link.link ? <Link to={link.link}>{link.name}</Link> : <span>{link.name}</span>}
        </div>
      ))}
    </div>
  );
};

export default CalculatorBreadcrumb;
