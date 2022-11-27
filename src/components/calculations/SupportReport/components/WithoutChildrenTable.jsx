/* eslint-disable jsx-a11y/control-has-associated-label */

import React from 'react';

import numeral from 'numeral';

import customGet from 'utils/get';

const WithoutChildrenTable = ({ spousalSupport, agreedSpousalSupport, className = 'col-10' }) => {
  const firstScenario = agreedSpousalSupport
    ? spousalSupport?.scenarios[4]
    : spousalSupport?.scenarios[0];
  const secondScenario = agreedSpousalSupport
    ? spousalSupport?.scenarios[0]
    : spousalSupport?.scenarios[1];
  const thirdScenario = spousalSupport?.scenarios[2];

  return (
    <div className={className}>
      <table className='table table-striped'>
        <thead>
          <tr>
            <th scope='col'>SSAG Spousal Scenario</th>
            <th scope='col'>{agreedSpousalSupport ? 'Agreed' : 'Low'}</th>
            <th scope='col'>{agreedSpousalSupport ? 'Low' : 'Mid'}</th>
            <th scope='col'>High</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope='row'>Percent/Year of Marriage</th>
            <td>1.5%</td>
            <td>1.75%</td>
            <td>2%</td>
          </tr>
          <tr>
            <th scope='row'>Years of Marriage/Cohabitation</th>
            <td>{spousalSupport?.durationOfRelationship}</td>
            <td>{spousalSupport?.durationOfRelationship}</td>
            <td>{spousalSupport?.durationOfRelationship}</td>
          </tr>
          <tr>
            <th scope='row'>Percent of Gross Income Differential</th>
            <td>{numeral(customGet(firstScenario, 'percent', 0)).format('0.00%')}</td>
            <td>{numeral(customGet(secondScenario, 'percent', 0)).format('0.00%')}</td>
            <td>{numeral(customGet(thirdScenario, 'percent', 0)).format('0.00%')}</td>
          </tr>
          <tr>
            <th scope='row'>Gross Income Differential (monthly)</th>
            <td>
              {numeral(customGet(spousalSupport, 'incomeDifferential', 0) / 12.0).format('($0,0')}
            </td>
            <td>
              {numeral(customGet(spousalSupport, 'incomeDifferential', 0) / 12.0).format('($0,0')}
            </td>
            <td>
              {numeral(customGet(spousalSupport, 'incomeDifferential', 0) / 12.0).format('($0,0')}
            </td>
          </tr>
          <tr>
            <th scope='row'>Spousal Support (monthly)</th>
            <td>
              {numeral(
                Math.abs(
                  Math.round(
                    customGet(firstScenario, `clientSpousalSupport.monthlySpousalSupport`, 0),
                  ),
                ),
              ).format('($0,0')}
            </td>
            <td>
              {numeral(
                Math.abs(
                  Math.round(
                    customGet(secondScenario, `clientSpousalSupport.monthlySpousalSupport`, 0),
                  ),
                ),
              ).format('($0,0')}
            </td>
            <td>
              {numeral(
                Math.abs(
                  Math.round(
                    customGet(thirdScenario, `clientSpousalSupport.monthlySpousalSupport`, 0),
                  ),
                ),
              ).format('($0,0')}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default WithoutChildrenTable;
