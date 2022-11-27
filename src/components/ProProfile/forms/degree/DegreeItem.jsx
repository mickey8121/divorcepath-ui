import React, { useMemo } from 'react';

import Button from 'components/common/Button';

const DegreeItem = ({ degree, edit, remove }) => {
  const { institution = '', abbreviation = '', year = '', degree: degreeName = '' } = degree || {};

  const description = useMemo(() => `${abbreviation}, ${year}`, [abbreviation, year]);

  return (
    <div className='item-row'>
      <div className='item-description'>
        <span className='title'>{`${degreeName} ${institution}`}</span>
        <div className='description'>
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

export default DegreeItem;
