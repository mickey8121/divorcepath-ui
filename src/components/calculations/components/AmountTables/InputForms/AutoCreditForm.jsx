import React from 'react';

import numeral from 'numeral';
import { get } from 'lodash';

import Icon from 'components/common/Icon';

const AutoCreditForm = ({ amount, displayInfo }) => (
  <div className='form-group text-muted mb-0'>
    <div className='text-muted mb-0'>
      <p className='pt-2'>
        <Icon name='info-circle' className='mr-2' height='20' width='20' />
        {displayInfo.description}
        <small>
          <a href={`${displayInfo.reference}`}>
            <Icon
              name='share'
              className='ml-2 mr-1'
              height='20'
              width='20'
              style={{ marginTop: '-2px' }}
            />
            Learn&nbsp;More
          </a>
        </small>
      </p>
      <p>
        <Icon name='triangle' className='mr-2' height='20' width='20' />
        This is an automatic credit. The base value of this credit is
        {numeral(get(amount, `defaultInputs.0.floatData`)).format(' ($0,0)')}
      </p>
    </div>
  </div>
);

export default AutoCreditForm;
