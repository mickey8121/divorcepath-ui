import React, { useMemo } from 'react';

import Button from 'components/common/Button';

const LocationItem = ({ location, edit, remove }) => {
  const { city, phone, street1, postal, residence } = location || {};

  const description = useMemo(
    () => `${residence}, ${street1}, ${postal}, ${phone}`,
    [residence, street1, postal, phone],
  );

  return (
    <div className='item-row'>
      <div className='item-description'>
        <span className='title'>{city}</span>
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

export default LocationItem;
