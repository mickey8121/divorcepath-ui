import React from 'react';

import classNames from 'classnames';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

const LegalIssueTooltip = ({ children, show, description, value, className }) => (
  <OverlayTrigger
    show={show}
    overlay={
      <Tooltip id='tooltip-top'>
        <p className='mb-0'>
          {description || 'You can change the description using the edit button'}
        </p>
      </Tooltip>
    }
  >
    <div className={classNames('custom-option-overlay', className)} id={value}>
      {children}
    </div>
  </OverlayTrigger>
);

export default LegalIssueTooltip;
