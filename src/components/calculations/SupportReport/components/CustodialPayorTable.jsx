/* eslint-disable jsx-a11y/control-has-associated-label */

import React from 'react';

import numeral from 'numeral';

import customGet from 'utils/get';

import WithoutChildrenTable from './WithoutChildrenTable';

const CustodialPayorTable = ({ spousalSupport, agreedSpousalSupport, clientName, exName }) => (
  <div className='row'>
    <div className='col-12'>
      <div className='col-8'>
        <table className='table table-striped'>
          <thead>
            <tr>
              <th scope='col' />
              <th scope='col'>{clientName}</th>
              <th scope='col'>{exName}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope='row'>Guideline Income (Annual)</th>
              <td>
                {numeral(
                  customGet(
                    spousalSupport,
                    'scenarios[0].clientSpousalSupport.income.spousalSupportGuidelineIncome',
                    0,
                  ),
                ).format('($0,0')}
              </td>
              <td>
                {numeral(
                  customGet(
                    spousalSupport,
                    'scenarios[0].exSpousalSupport.income.spousalSupportGuidelineIncome',
                    0,
                  ),
                ).format('($0,0')}
              </td>
            </tr>
            <tr>
              <th scope='row'>Guideline Income (Monthly)</th>
              <td>
                {numeral(
                  customGet(
                    spousalSupport,
                    'scenarios[0].clientSpousalSupport.income.spousalSupportGuidelineIncome',
                    0,
                  ) / 12.0,
                ).format('($0,0')}
              </td>
              <td>
                {numeral(
                  customGet(
                    spousalSupport,
                    'scenarios[0].exSpousalSupport.income.spousalSupportGuidelineIncome',
                    0,
                  ) / 12.0,
                ).format('($0,0')}
              </td>
            </tr>
            <tr>
              <th scope='row'>Child Support (Notional or Table)</th>
              <td>
                {numeral(customGet(spousalSupport, 'clientCustodialPayorCs', 0) / 12.0).format(
                  '($0,0',
                )}
              </td>
              <td>
                {numeral(customGet(spousalSupport, 'exCustodialPayorCs', 0) / 12.0).format('($0,0')}
              </td>
            </tr>
            <tr>
              <th scope='row'>Gross-Up of Child Support</th>
              <td>
                {numeral(
                  customGet(spousalSupport, 'clientCustodialPayorCsGrossUp', 0) / 12.0,
                ).format('($0,0')}
              </td>
              <td>
                {numeral(
                  customGet(spousalSupport, 'exCustodialPayorCsGrossUp', 0)
                    .toString()
                    .substr(0, 15) / 12.0,
                ).format('($0,0')}
              </td>
            </tr>
            <tr>
              <th scope='row'>Adjusted Guideline Income</th>
              <td>
                {numeral(
                  customGet(spousalSupport, 'clientAdjustedGuidelineIncome', 0) / 12.0,
                ).format('($0,0')}
              </td>
              <td>
                {numeral(customGet(spousalSupport, 'exAdjustedGuidelineIncome', 0) / 12.0).format(
                  '($0,0',
                )}
              </td>
            </tr>
            <tr>
              <th scope='row'>Gross Income Differential</th>
              <td colSpan='2'>
                {numeral(customGet(spousalSupport, 'incomeDifferential', 0) / 12.0).format('($0,0')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className='p-2'>
        <strong>The Custodial Payor Spousal Support Formula:</strong> Where the party paying spousal
        support is also the primary parent and net recipient of child support, spousal support is
        calculated based on the difference between the parties' incomes after grossing-up notional
        child support (for the spousal support payor) and grossing-up net child support paid (for
        the child support payor). Support is then calculated based on the duration of the
        relationship and the income differential between the parties.
      </p>

      <WithoutChildrenTable
        spousalSupport={spousalSupport}
        clientName={clientName}
        exName={exName}
        agreedSpousalSupport={agreedSpousalSupport}
      />
    </div>
  </div>
);

export default CustodialPayorTable;
