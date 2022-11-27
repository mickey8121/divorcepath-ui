import React from 'react';

import classNames from 'classnames';
import kebabCase from 'lodash/kebabCase';
import capitalize from 'lodash/capitalize';
import startCase from 'lodash/startCase';

const types = {
  POTENTIAL: 'Potential Client',
  RETAINED: 'Retained',
  NOT_RETAINED: 'Did not Retain',
};

const ClientType = ({ client }) => {
  return (
    <span className={classNames('client-type', kebabCase(client?.type))}>
      {types[client?.type] || capitalize(startCase(client?.type))}
    </span>
  );
};

export default ClientType;
