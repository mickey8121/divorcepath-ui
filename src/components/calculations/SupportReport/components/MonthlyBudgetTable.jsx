/* eslint-disable jsx-a11y/control-has-associated-label */

import React from 'react';

import numeral from 'numeral';

import GroupedBarChart from 'components/charts/GroupedBarChart';
import BarChart from 'components/charts/BarChart';

import customGet from 'utils/get';

const MonthlyBudgetTable = ({
  spousalSupport,
  clientName,
  exName,
  showSpousalSupport,
  agreedSpousalSupport,
}) => {
  const firstScenario = agreedSpousalSupport
    ? spousalSupport?.scenarios?.[4]
    : spousalSupport?.scenarios?.[0];
  const secondScenario = agreedSpousalSupport
    ? spousalSupport?.scenarios?.[0]
    : spousalSupport?.scenarios?.[1];
  const thirdScenario = spousalSupport?.scenarios?.[2];
  const noSpousalScenario = spousalSupport?.scenarios?.[3];

  const chartLabels = agreedSpousalSupport
    ? ['Budget Agreed Spousal', 'Budget Low Spousal', 'Budget High Spousal']
    : ['Budget Low Spousal', 'Budget Mid Spousal', 'Budget High Spousal'];

  let clientData = [];
  let exData = [];
  let barData = [];

  const clientCash = [
    customGet(firstScenario, 'clientSpousalSupport.monthlyCash', 0) / 12.0,
    customGet(secondScenario, 'clientSpousalSupport.monthlyCash', 0) / 12.0,
    customGet(thirdScenario, 'clientSpousalSupport.monthlyCash', 0) / 12.0,
    customGet(noSpousalScenario, 'clientSpousalSupport.monthlyCash', 0) / 12.0,
  ];

  const exCash = [
    customGet(firstScenario, 'exSpousalSupport.monthlyCash', 0) / 12.0,
    customGet(secondScenario, 'exSpousalSupport.monthlyCash', 0) / 12.0,
    customGet(thirdScenario, 'exSpousalSupport.monthlyCash', 0) / 12.0,
    customGet(noSpousalScenario, 'exSpousalSupport.monthlyCash', 0) / 12.0,
  ];

  if (showSpousalSupport) {
    clientData = [Math.round(clientCash[0]), Math.round(clientCash[1]), Math.round(clientCash[2])];
    exData = [Math.round(exCash[0]), Math.round(exCash[1]), Math.round(exCash[2])];
  } else {
    clientData = [Math.round(clientCash[3])];
    exData = [Math.round(exCash[3])];
    barData = [clientData[0], exData[0]];
  }

  if (clientData[0] === 0 && exData[0] === 0) {
    clientData = [1, 1, 1];
    exData = [1, 1, 1];
  }

  return (
    <div className='row no-gutters'>
      <div className='col-12'>
        <div className='td-doughnut-chart' />
        {showSpousalSupport ? (
          <div className='td-bar-chart ml-auto chart-row'>
            <GroupedBarChart
              data1={clientData}
              data2={exData}
              labels={chartLabels}
              instant
              displayClass='grouped-chart-details-container'
            />
          </div>
        ) : (
          <div
            className='td-bar-chart'
            style={{ width: '25%', paddingTop: 30, margin: '0%', display: 'inline-block' }}
          >
            <strong className='mb-2'>Budget Income</strong>
            <br />
            <br />
            <BarChart
              data={barData}
              labels={[clientName, exName]}
              instant
              displayClass='grouped-chart-details-container'
            />
          </div>
        )}
        <table className={`table table-striped ${!showSpousalSupport && 'col-6'}`}>
          <thead>
            <tr>
              <th scope='col' />
              {showSpousalSupport && (
                <React.Fragment>
                  <th scope='col'>{clientName}</th>
                  <th scope='col'>{exName}</th>
                  <th scope='col' className='table-middle'>
                    {clientName}
                  </th>
                  <th scope='col' className='table-middle'>
                    {exName}
                  </th>
                </React.Fragment>
              )}
              <th scope='col'>{clientName}</th>
              <th scope='col'>{exName}</th>
            </tr>
          </thead>

          {/* eslint-disable */}
          <tbody>
            <tr>
              <th scope='row'>Pre-Support Monthly Income</th>
              {showSpousalSupport ? (
                <React.Fragment>
                  <td>
                    {numeral(
                      customGet(firstScenario, 'clientSpousalSupport.monthlyGuidelineIncome', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(firstScenario, 'exSpousalSupport.monthlyGuidelineIncome', 0),
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(secondScenario, 'clientSpousalSupport.monthlyGuidelineIncome', 0),
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(secondScenario, 'exSpousalSupport.monthlyGuidelineIncome', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(thirdScenario, 'clientSpousalSupport.monthlyGuidelineIncome', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(thirdScenario, 'exSpousalSupport.monthlyGuidelineIncome', 0),
                    ).format('($0,0')}
                  </td>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <td>
                    {numeral(
                      customGet(
                        noSpousalScenario,
                        'clientSpousalSupport.monthlyGuidelineIncome',
                        0,
                      ),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(noSpousalScenario, 'exSpousalSupport.monthlyGuidelineIncome', 0),
                    ).format('($0,0')}
                  </td>
                </React.Fragment>
              )}
            </tr>
            <tr>
              <th scope='row'>Monthly Total Support</th>
              {showSpousalSupport ? (
                <React.Fragment>
                  <td>
                    {numeral(
                      customGet(firstScenario, 'clientSpousalSupport.monthlyTotalSupport', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(firstScenario, 'exSpousalSupport.monthlyTotalSupport', 0),
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(secondScenario, 'clientSpousalSupport.monthlyTotalSupport', 0),
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(secondScenario, 'exSpousalSupport.monthlyTotalSupport', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(thirdScenario, 'clientSpousalSupport.monthlyTotalSupport', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(thirdScenario, 'exSpousalSupport.monthlyTotalSupport', 0),
                    ).format('($0,0')}
                  </td>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <td>
                    {numeral(
                      customGet(noSpousalScenario, 'clientSpousalSupport.monthlyTotalSupport', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(noSpousalScenario, 'exSpousalSupport.monthlyTotalSupport', 0),
                    ).format('($0,0')}
                  </td>
                </React.Fragment>
              )}
            </tr>
            <tr>
              <th scope='row'>Monthly Taxes</th>
              {showSpousalSupport ? (
                <React.Fragment>
                  <td>
                    {numeral(
                      customGet(firstScenario, 'clientSpousalSupport.monthlyTax', 0) * -1,
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(firstScenario, 'exSpousalSupport.monthlyTax', 0) * -1,
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(secondScenario, 'clientSpousalSupport.monthlyTax', 0) * -1,
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(secondScenario, 'exSpousalSupport.monthlyTax', 0) * -1,
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(thirdScenario, 'clientSpousalSupport.monthlyTax', 0) * -1,
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(thirdScenario, 'exSpousalSupport.monthlyTax', 0) * -1,
                    ).format('($0,0')}
                  </td>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <td>
                    {numeral(
                      customGet(noSpousalScenario, 'clientSpousalSupport.monthlyTax', 0) * -1,
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(noSpousalScenario, 'exSpousalSupport.monthlyTax', 0) * -1,
                    ).format('($0,0')}
                  </td>
                </React.Fragment>
              )}
            </tr>
            <tr>
              <th scope='row'>Monthly Benefits</th>
              {showSpousalSupport ? (
                <React.Fragment>
                  <td>
                    {numeral(
                      customGet(firstScenario, 'clientSpousalSupport.monthlyBenefits', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(firstScenario, 'exSpousalSupport.monthlyBenefits', 0),
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(secondScenario, 'clientSpousalSupport.monthlyBenefits', 0),
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(secondScenario, 'exSpousalSupport.monthlyBenefits', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(thirdScenario, 'clientSpousalSupport.monthlyBenefits', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(thirdScenario, 'exSpousalSupport.monthlyBenefits', 0),
                    ).format('($0,0')}
                  </td>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <td>
                    {numeral(
                      customGet(noSpousalScenario, 'clientSpousalSupport.monthlyBenefits', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(noSpousalScenario, 'exSpousalSupport.monthlyBenefits', 0),
                    ).format('($0,0')}
                  </td>
                </React.Fragment>
              )}
            </tr>
            <tr>
              <th scope='row'>Net After-Tax Monthly Cash Flow</th>
              {showSpousalSupport ? (
                <React.Fragment>
                  <td>{numeral(clientCash[0]).format('($0,0')}</td>
                  <td>{numeral(exCash[0]).format('($0,0')}</td>
                  <td className='table-middle'>{numeral(clientCash[1]).format('($0,0')}</td>
                  <td className='table-middle'>{numeral(exCash[1]).format('($0,0')}</td>
                  <td>{numeral(clientCash[2]).format('($0,0')}</td>
                  <td>{numeral(exCash[2]).format('($0,0')}</td>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <td>{numeral(clientCash[3]).format('($0,0')}</td>
                  <td>{numeral(exCash[3]).format('($0,0')}</td>
                </React.Fragment>
              )}
            </tr>
            <tr>
              <th scope='row'>Net After-Tax Annual Cash Flow</th>
              {showSpousalSupport ? (
                <React.Fragment>
                  <td>{numeral(clientCash[0] * 12).format('($0,0')}</td>
                  <td>{numeral(exCash[0] * 12).format('($0,0')}</td>
                  <td className='table-middle'>{numeral(clientCash[1] * 12).format('($0,0')}</td>
                  <td className='table-middle'>{numeral(exCash[1] * 12).format('($0,0')}</td>
                  <td>{numeral(clientCash[2] * 12).format('($0,0')}</td>
                  <td>{numeral(exCash[2] * 12).format('($0,0')}</td>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <td>{numeral(clientCash[3] * 12).format('($0,0')}</td>
                  <td>{numeral(exCash[3] * 12).format('($0,0')}</td>
                </React.Fragment>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthlyBudgetTable;
