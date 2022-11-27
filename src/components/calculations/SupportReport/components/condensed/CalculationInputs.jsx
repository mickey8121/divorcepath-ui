import React, { useCallback } from 'react';

import numeral from 'numeral';
import { get, findIndex } from 'lodash';

const CalculationInputs = ({ labels, title, inputs, path, type }) => {
  const getValuePath = useCallback(
    input => {
      if (!type) return path;

      const index = findIndex(input.userInputs, userInput => userInput.name === type);

      return `userInputs[${index}].floatData`;
    },
    [type, path],
  );

  return (
    <React.Fragment>
      {title && <div className='details-row-title'>{title}</div>}
      {inputs?.map((input, index) => {
        const label = labels?.find(item => item.key === input.key);
        return (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index} className='details-row row justify-content-end'>
            <span className='details-label'>{label?.label}</span>
            <span className='details-amount'>
              {numeral(get(input, getValuePath(input), 0)).format('($0,0')}
            </span>
          </div>
        );
      })}
    </React.Fragment>
  );
};

export default CalculationInputs;
