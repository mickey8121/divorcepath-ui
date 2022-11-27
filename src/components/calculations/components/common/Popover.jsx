import React from 'react';
import { Link } from 'react-router-dom';
import { PopoverBody, UncontrolledPopover } from 'reactstrap';

export default ({ target, text }) => (
  <UncontrolledPopover placement='top' target={target} fade>
    <PopoverBody>
      <Link to='/plans'>{text || 'Subscribe to unlock'}</Link>
    </PopoverBody>
  </UncontrolledPopover>
);
