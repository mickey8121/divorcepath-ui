import React, { useMemo } from 'react';

import Button from 'components/common/Button';

const JurisdictionItem = ({ jurisdiction, edit, remove }) => {
  const { year = '', jurisdiction: jurisdictionName = '' } = jurisdiction || {};

  const description = useMemo(() => year, [year]);

  return (
    <div className='item-row'>
      <div className='item-description'>
        <span className='city'>{jurisdictionName}</span>
        <div className='description' title={description}>
          <span>{description}</span>
        </div>
      </div>

      <div className='item-col'>
        <Button color='link' size='sm' onClick={edit} leftIcon='edit' />
        <Button color='red-link' size='sm' onClick={remove} leftIcon='trash' />
      </div>
    </div>
  );
};

export default JurisdictionItem;
