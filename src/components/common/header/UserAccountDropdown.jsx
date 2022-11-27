import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { DropdownItem, DropdownToggle, Dropdown, DropdownMenu } from 'reactstrap';

import useCurrentUser from 'hooks/useCurrentUser';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const UserAccountDropdown = ({ userName, pathToProfile }) => {
  const { logout } = useCurrentUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(prevState => !prevState);

  return (
    <Dropdown
      isOpen={dropdownOpen}
      toggle={toggle}
      className='nav-item dropdown user-dropdown dropdown-animate'
      size='sm'
    >
      <DropdownToggle caret className='nav-link dropdown-toggle user-dropdown-toggle'>
        <FontAwesomeIcon icon='user-circle' className='mr-2' />
        <span className='d-none d-sm-inline'>{userName}</span>
        <span className='d-inline d-sm-none'>Account</span>
      </DropdownToggle>
      <DropdownMenu className={classnames('dropdown-menu-arrow', { show: dropdownOpen })}>
        <DropdownItem tag={Link} to={pathToProfile}>
          <FontAwesomeIcon icon='user-circle' />
          <span> Your Profile</span>
        </DropdownItem>
        <DropdownItem onClick={logout}>
          <FontAwesomeIcon icon='sign-out-alt' />
          <span> Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default UserAccountDropdown;
