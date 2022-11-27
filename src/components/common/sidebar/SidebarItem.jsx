import React from 'react';

import { NavLink } from 'react-router-dom';
import { ListGroupItem } from 'reactstrap';

import Icon from 'components/common/Icon';

const SidebarItem = ({
  pathname,
  label,
  icon,
  exact,
  disabled,
  hidden,
  activeClass = 'active',
  status = 'INCOMPLETE',
}) => {
  if (hidden) return null;

  return (
    <ListGroupItem
      tag={NavLink}
      className='list-group-item-action'
      activeClassName={activeClass}
      to={pathname}
      exact={exact}
      style={disabled ? { opacity: 0.6, cursor: 'not-allowed', pointerEvents: 'none' } : null}
    >
      <div className='main-item-content'>
        <Icon name={icon} width={16} height={16} />
        <span>{label}</span>
      </div>
      <Icon name={status === 'COMPLETE' ? 'check-stroke' : 'arrow-down'} width={16} height={16} />
    </ListGroupItem>
  );
};

export default SidebarItem;
