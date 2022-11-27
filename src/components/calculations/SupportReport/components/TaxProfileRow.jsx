import React from 'react';

import numeral from 'numeral';

import customGet from 'utils/get';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const TaxProfileRow = ({
  amount,
  index,
  amountType,
  fieldLabel,
  party,
  scenarios,
  agreedSpousalSupport,
  showSpousalSupport,
}) => {
  const firstScenario = showSpousalSupport
    ? agreedSpousalSupport
      ? scenarios[4]
      : scenarios[0]
    : scenarios[3];

  const secondScenario = agreedSpousalSupport ? scenarios[0] : scenarios[1];
  const thirdScenario = scenarios[2];

  // has the user supplied custom input for the amount?
  const editedAmount = amount.status === 'USER_EDITED';

  // is the amount manually added by the user?
  const manualAmount = amount.status === 'USER_ADDED';

  const userFloat = customGet(amount, `userInputs.0.floatData`);
  const valuePath =
    fieldLabel === 'Credits'
      ? userFloat || userFloat === 0
        ? 'userInputs[0].floatData'
        : 'defaultInputs[0].floatData'
      : amount.userAmount
      ? 'userAmount'
      : 'amount';

  return (
    <div className='details-row row justify-content-end'>
      <span className='tax-row-label'>
        {manualAmount && <FontAwesomeIcon icon='edit' className='mr-2' />}
        {editedAmount && <FontAwesomeIcon icon='exclamation-triangle' className='mr-2' />}
        {amount.label}
      </span>
      <span className='tax-row-amount'>
        {numeral(
          customGet(
            firstScenario,
            `${party}SpousalSupport.${amountType}.all.${index}.${valuePath}`,
            0,
          ),
        ).format('($0,0')}
      </span>
      {showSpousalSupport && (
        <React.Fragment>
          <span className='tax-row-amount'>
            {numeral(
              customGet(
                secondScenario,
                `${party}SpousalSupport.${amountType}.all.${index}.${valuePath}`,
                0,
              ),
            ).format('($0,0')}
          </span>
          <span className='tax-row-amount'>
            {numeral(
              customGet(
                thirdScenario,
                `${party}SpousalSupport.${amountType}.all.${index}.${valuePath}`,
                0,
              ),
            ).format('($0,0')}
          </span>
        </React.Fragment>
      )}
    </div>
  );
};

export default TaxProfileRow;
