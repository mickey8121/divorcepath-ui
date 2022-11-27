import React from 'react';

import classnames from 'classnames';
import { ButtonGroup, Button } from 'reactstrap';

const TogglePlanButtons = ({ buttons, currentValue }) => (
  <ButtonGroup className='custom-btn-group'>
    {buttons.map(({ value, label, onClick }) => (
      <Button
        color='secondary'
        size='lg'
        key={value}
        value={value}
        className={classnames({
          active: value === currentValue,
        })}
        onClick={onClick}
      >
        {label}
      </Button>
    ))}
  </ButtonGroup>
);

export default TogglePlanButtons;
