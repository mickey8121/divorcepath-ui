/* eslint-disable jsx-a11y/control-has-associated-label */

import React from 'react';

import numeral from 'numeral';

import GroupedBarChart from 'components/charts/GroupedBarChart';
import DonutChart from 'components/charts/DonutChart';
import BarChart from 'components/charts/BarChart';

import customGet from 'utils/get';
import toUSD from 'utils/toUSD';

const SpecialExpensesTable = ({
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
    ? ['Expenses with Agreed Spousal', 'Expenses with Low Spousal', 'Expenses with High Spousal']
    : ['Expenses with Low Spousal', 'Expenses with Mid Spousal', 'Expenses with High Spousal'];

  let clientData = [];
  let exData = [];
  let donutData = [];
  let barData = [];

  if (showSpousalSupport) {
    clientData = [
      Math.round(customGet(firstScenario, 'clientSpousalSupport.childExpenses.share', 1)),
      Math.round(customGet(secondScenario, 'clientSpousalSupport.childExpenses.share', 1)),
      Math.round(customGet(thirdScenario, 'clientSpousalSupport.childExpenses.share', 1)),
    ];
    exData = [
      Math.round(customGet(firstScenario, 'exSpousalSupport.childExpenses.share', 1)),
      Math.round(customGet(secondScenario, 'exSpousalSupport.childExpenses.share', 1)),
      Math.round(customGet(thirdScenario, 'exSpousalSupport.childExpenses.share', 1)),
    ];
  } else {
    clientData = [
      Math.round(customGet(noSpousalScenario, 'clientSpousalSupport.childExpenses.share', 1)),
    ];
    exData = [Math.round(customGet(noSpousalScenario, 'exSpousalSupport.childExpenses.share', 1))];
    barData = [Math.round(clientData), Math.round(exData)];
    donutData = barData[0] === 0 && barData[1] === 0 ? [1, 1] : barData;
  }

  if (clientData[0] === 0 && exData[0] === 0) {
    clientData = [1, 1, 1];
    exData = [1, 1, 1];
  }

  return (
    <div className='row'>
      <div className='col-12'>
        {showSpousalSupport ? (
          <div className='td-bar-chart ml-auto'>
            <GroupedBarChart
              data1={clientData}
              data2={exData}
              labels={chartLabels}
              instant
              displayClass='grouped-chart-details-container'
            />
          </div>
        ) : (
          <div className='d-flex chart-row'>
            <div className='td-doughnut-chart'>
              <div style={{ width: '70%', paddingTop: 20, margin: '4%', display: 'inline-block' }}>
                <strong className='mb-2'>Expense Support</strong>
                <DonutChart
                  data={donutData}
                  subtext='monthly'
                  instant
                  text={toUSD(
                    Math.round(
                      Math.abs(
                        customGet(
                          noSpousalScenario,
                          'clientSpousalSupport.childExpenses.monthlySupport',
                          1,
                        ),
                      ),
                    ),
                  )}
                />
              </div>
            </div>
            <div
              className='td-bar-chart'
              style={{ width: '25%', paddingTop: 30, margin: '0%', display: 'inline-block' }}
            >
              <strong className='mb-2'>Share of Net Expenses</strong>
              <br />
              <br />
              <BarChart
                data={barData}
                labels={[clientName, exName]}
                instant
                displayClass='grouped-chart-details-container'
              />
            </div>
          </div>
        )}
        <table className={`table table-striped ${!showSpousalSupport && 'col-6'}`}>
          <thead>
            <tr>
              <th />
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
              <th scope='row'>Total Expenses (Annual)</th>
              {showSpousalSupport ? (
                <React.Fragment>
                  <td>
                    {numeral(
                      customGet(
                        firstScenario,
                        'clientSpousalSupport.childExpenses.totalExpenses',
                        0,
                      ),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(firstScenario, 'exSpousalSupport.childExpenses.totalExpenses', 0),
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(
                        secondScenario,
                        'clientSpousalSupport.childExpenses.totalExpenses',
                        0,
                      ),
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(secondScenario, 'exSpousalSupport.childExpenses.totalExpenses', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(
                        thirdScenario,
                        'clientSpousalSupport.childExpenses.totalExpenses',
                        0,
                      ),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(thirdScenario, 'exSpousalSupport.childExpenses.totalExpenses', 0),
                    ).format('($0,0')}
                  </td>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <td>
                    {numeral(
                      customGet(
                        noSpousalScenario,
                        'clientSpousalSupport.childExpenses.totalExpenses',
                        0,
                      ),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(
                        noSpousalScenario,
                        'exSpousalSupport.childExpenses.totalExpenses',
                        0,
                      ),
                    ).format('($0,0')}
                  </td>
                </React.Fragment>
              )}
            </tr>
            <tr>
              <th scope=''>Expenses Paid (Annual)</th>
              {showSpousalSupport ? (
                <React.Fragment>
                  <td>
                    {numeral(
                      customGet(firstScenario, 'clientSpousalSupport.childExpenses.paid', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(firstScenario, 'exSpousalSupport.childExpenses.paid', 0),
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(secondScenario, 'clientSpousalSupport.childExpenses.paid', 0),
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(secondScenario, 'exSpousalSupport.childExpenses.paid', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(thirdScenario, 'clientSpousalSupport.childExpenses.paid', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(thirdScenario, 'exSpousalSupport.childExpenses.paid', 0),
                    ).format('($0,0')}
                  </td>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <td>
                    {numeral(
                      customGet(noSpousalScenario, 'clientSpousalSupport.childExpenses.paid', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(noSpousalScenario, 'exSpousalSupport.childExpenses.paid', 0),
                    ).format('($0,0')}
                  </td>
                </React.Fragment>
              )}
            </tr>
            <tr>
              <th scope='row'>Change in Benefits</th>
              {showSpousalSupport ? (
                <React.Fragment>
                  <td>
                    {numeral(
                      customGet(
                        firstScenario,
                        'clientSpousalSupport.childExpenses.additionalBenefits',
                        0,
                      ),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(
                        firstScenario,
                        'exSpousalSupport.childExpenses.additionalBenefits',
                        0,
                      ),
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(
                        secondScenario,
                        'clientSpousalSupport.childExpenses.additionalBenefits',
                        0,
                      ),
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(
                        secondScenario,
                        'exSpousalSupport.childExpenses.additionalBenefits',
                        0,
                      ),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(
                        thirdScenario,
                        'clientSpousalSupport.childExpenses.additionalBenefits',
                        0,
                      ),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(
                        thirdScenario,
                        'exSpousalSupport.childExpenses.additionalBenefits',
                        0,
                      ),
                    ).format('($0,0')}
                  </td>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <td>
                    {numeral(
                      customGet(
                        noSpousalScenario,
                        'clientSpousalSupport.childExpenses.additionalBenefits',
                        0,
                      ),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(
                        noSpousalScenario,
                        'exSpousalSupport.childExpenses.additionalBenefits',
                        0,
                      ),
                    ).format('($0,0')}
                  </td>
                </React.Fragment>
              )}
            </tr>
            <tr>
              <th scope='row'>Change in Taxes</th>
              {showSpousalSupport ? (
                <React.Fragment>
                  <td>
                    {numeral(
                      customGet(firstScenario, 'clientSpousalSupport.childExpenses.taxSavings', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(firstScenario, 'exSpousalSupport.childExpenses.taxSavings', 0),
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(secondScenario, 'clientSpousalSupport.childExpenses.taxSavings', 0),
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(secondScenario, 'exSpousalSupport.childExpenses.taxSavings', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(thirdScenario, 'clientSpousalSupport.childExpenses.taxSavings', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(thirdScenario, 'exSpousalSupport.childExpenses.taxSavings', 0),
                    ).format('($0,0')}
                  </td>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <td>
                    {numeral(
                      customGet(
                        noSpousalScenario,
                        'clientSpousalSupport.childExpenses.taxSavings',
                        0,
                      ),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(noSpousalScenario, 'exSpousalSupport.childExpenses.taxSavings', 0),
                    ).format('($0,0')}
                  </td>
                </React.Fragment>
              )}
            </tr>
            <tr>
              <th scope='row'>Net Expenses Paid</th>
              {showSpousalSupport ? (
                <React.Fragment>
                  <td>
                    {numeral(
                      customGet(firstScenario, 'clientSpousalSupport.childExpenses.netPaid', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(firstScenario, 'exSpousalSupport.childExpenses.netPaid', 0),
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(secondScenario, 'clientSpousalSupport.childExpenses.netPaid', 0),
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(secondScenario, 'exSpousalSupport.childExpenses.netPaid', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(thirdScenario, 'clientSpousalSupport.childExpenses.netPaid', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(thirdScenario, 'exSpousalSupport.childExpenses.netPaid', 0),
                    ).format('($0,0')}
                  </td>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <td>
                    {numeral(
                      customGet(noSpousalScenario, 'clientSpousalSupport.childExpenses.netPaid', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(noSpousalScenario, 'exSpousalSupport.childExpenses.netPaid', 0),
                    ).format('($0,0')}
                  </td>
                </React.Fragment>
              )}
            </tr>
            <tr>
              <th scope='row'>Guideline Income</th>
              {showSpousalSupport ? (
                <React.Fragment>
                  <td>
                    {numeral(
                      customGet(
                        firstScenario,
                        'clientSpousalSupport.childExpenses.guidelineIncome',
                        0,
                      ),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(firstScenario, 'exSpousalSupport.childExpenses.guidelineIncome', 0),
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(
                        secondScenario,
                        'clientSpousalSupport.childExpenses.guidelineIncome',
                        0,
                      ),
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(
                        secondScenario,
                        'exSpousalSupport.childExpenses.guidelineIncome',
                        0,
                      ),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(
                        thirdScenario,
                        'clientSpousalSupport.childExpenses.guidelineIncome',
                        0,
                      ),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(thirdScenario, 'exSpousalSupport.childExpenses.guidelineIncome', 0),
                    ).format('($0,0')}
                  </td>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <td>
                    {numeral(
                      customGet(
                        noSpousalScenario,
                        'clientSpousalSupport.childExpenses.guidelineIncome',
                        0,
                      ),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(
                        noSpousalScenario,
                        'exSpousalSupport.childExpenses.guidelineIncome',
                        0,
                      ),
                    ).format('($0,0')}
                  </td>
                </React.Fragment>
              )}
            </tr>
            {showSpousalSupport && (<tr>
              <th scope='row'>Spousal Support (Annual)</th>
              <React.Fragment>
                <td>
                  {numeral(
                    customGet(firstScenario, 'clientSpousalSupport.monthlySpousalSupport', 0) *
                    12,
                  ).format('($0,0')}
                </td>
                <td>
                  {numeral(
                    customGet(firstScenario, 'exSpousalSupport.monthlySpousalSupport', 0) * 12,
                  ).format('($0,0')}
                </td>
                <td className='table-middle'>
                  {numeral(
                    customGet(secondScenario, 'clientSpousalSupport.monthlySpousalSupport', 0) *
                    12,
                  ).format('($0,0')}
                </td>
                <td className='table-middle'>
                  {numeral(
                    customGet(secondScenario, 'exSpousalSupport.monthlySpousalSupport', 0) * 12,
                  ).format('($0,0')}
                </td>
                <td>
                  {numeral(
                    customGet(thirdScenario, 'clientSpousalSupport.monthlySpousalSupport', 0) *
                    12,
                  ).format('($0,0')}
                </td>
                <td>
                  {numeral(
                    customGet(thirdScenario, 'exSpousalSupport.monthlySpousalSupport', 0) * 12,
                  ).format('($0,0')}
                </td>
              </React.Fragment>
            </tr>)}
            {showSpousalSupport && (<tr>
              <th scope='row'>Adjusted Income</th>
              <React.Fragment>
                <td>
                  {numeral(
                    customGet(
                      firstScenario,
                      'clientSpousalSupport.childExpenses.adjustedIncome',
                      0,
                    ),
                  ).format('($0,0')}
                </td>
                <td>
                  {numeral(
                    customGet(firstScenario, 'exSpousalSupport.childExpenses.adjustedIncome', 0),
                  ).format('($0,0')}
                </td>
                <td className='table-middle'>
                  {numeral(
                    customGet(
                      secondScenario,
                      'clientSpousalSupport.childExpenses.adjustedIncome',
                      0,
                    ),
                  ).format('($0,0')}
                </td>
                <td className='table-middle'>
                  {numeral(
                    customGet(secondScenario, 'exSpousalSupport.childExpenses.adjustedIncome', 0),
                  ).format('($0,0')}
                </td>
                <td>
                  {numeral(
                    customGet(
                      thirdScenario,
                      'clientSpousalSupport.childExpenses.adjustedIncome',
                      0,
                    ),
                  ).format('($0,0')}
                </td>
                <td>
                  {numeral(
                    customGet(thirdScenario, 'exSpousalSupport.childExpenses.adjustedIncome', 0),
                  ).format('($0,0')}
                </td>
              </React.Fragment>
            </tr>)}
            <tr>
              <th scope='row'>Share of Expenses (%)</th>
              {showSpousalSupport ? (
                <React.Fragment>
                  <td>
                    {numeral(
                      customGet(
                        firstScenario,
                        'clientSpousalSupport.childExpenses.percentShare',
                        0,
                      ),
                    ).format('00.00%')}
                  </td>
                  <td>
                    {numeral(
                      customGet(firstScenario, 'exSpousalSupport.childExpenses.percentShare', 0),
                    ).format('00.00%')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(
                        secondScenario,
                        'clientSpousalSupport.childExpenses.percentShare',
                        0,
                      ),
                    ).format('00.00%')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(secondScenario, 'exSpousalSupport.childExpenses.percentShare', 0),
                    ).format('00.00%')}
                  </td>
                  <td>
                    {numeral(
                      customGet(
                        thirdScenario,
                        'clientSpousalSupport.childExpenses.percentShare',
                        0,
                      ),
                    ).format('00.00%')}
                  </td>
                  <td>
                    {numeral(
                      customGet(thirdScenario, 'exSpousalSupport.childExpenses.percentShare', 0),
                    ).format('00.00%')}
                  </td>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <td>
                    {numeral(
                      customGet(
                        noSpousalScenario,
                        'clientSpousalSupport.childExpenses.percentShare',
                        0,
                      ),
                    ).format('00.00%')}
                  </td>
                  <td>
                    {numeral(
                      customGet(
                        noSpousalScenario,
                        'exSpousalSupport.childExpenses.percentShare',
                        0,
                      ),
                    ).format('00.00%')}
                  </td>
                </React.Fragment>
              )}
            </tr>
            <tr>
              <th>Share of Expenses ($)</th>
              {showSpousalSupport ? (
                <React.Fragment>
                  <td>
                    {numeral(
                      customGet(firstScenario, 'clientSpousalSupport.childExpenses.share', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(firstScenario, 'exSpousalSupport.childExpenses.share', 0),
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(secondScenario, 'clientSpousalSupport.childExpenses.share', 0),
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(secondScenario, 'exSpousalSupport.childExpenses.share', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(thirdScenario, 'clientSpousalSupport.childExpenses.share', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(thirdScenario, 'exSpousalSupport.childExpenses.share', 0),
                    ).format('($0,0')}
                  </td>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <td>
                    {numeral(
                      customGet(noSpousalScenario, 'clientSpousalSupport.childExpenses.share', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(noSpousalScenario, 'exSpousalSupport.childExpenses.share', 0),
                    ).format('($0,0')}
                  </td>
                </React.Fragment>
              )}
            </tr>
            <tr>
              <th scope='row'>Expense Support (Annual)</th>
              {showSpousalSupport ? (
                <React.Fragment>
                  <td>
                    {numeral(
                      customGet(firstScenario, 'clientSpousalSupport.childExpenses.support', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(firstScenario, 'exSpousalSupport.childExpenses.support', 0),
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(secondScenario, 'clientSpousalSupport.childExpenses.support', 0),
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(secondScenario, 'exSpousalSupport.childExpenses.support', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(thirdScenario, 'clientSpousalSupport.childExpenses.support', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(thirdScenario, 'exSpousalSupport.childExpenses.support', 0),
                    ).format('($0,0')}
                  </td>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <td>
                    {numeral(
                      customGet(noSpousalScenario, 'clientSpousalSupport.childExpenses.support', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(noSpousalScenario, 'exSpousalSupport.childExpenses.support', 0),
                    ).format('($0,0')}
                  </td>
                </React.Fragment>
              )}
            </tr>
            <tr>
              <th scope='row'>Expense Support (Avg. Monthly)</th>
              {showSpousalSupport ? (
                <React.Fragment>
                  <td>
                    {numeral(
                      customGet(
                        firstScenario,
                        'clientSpousalSupport.childExpenses.monthlySupport',
                        0,
                      ),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(firstScenario, 'exSpousalSupport.childExpenses.monthlySupport', 0),
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(
                        secondScenario,
                        'clientSpousalSupport.childExpenses.monthlySupport',
                        0,
                      ),
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(secondScenario, 'exSpousalSupport.childExpenses.monthlySupport', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(
                        thirdScenario,
                        'clientSpousalSupport.childExpenses.monthlySupport',
                        0,
                      ),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(thirdScenario, 'exSpousalSupport.childExpenses.monthlySupport', 0),
                    ).format('($0,0')}
                  </td>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <td>
                    {numeral(
                      customGet(
                        noSpousalScenario,
                        'clientSpousalSupport.childExpenses.monthlySupport',
                        0,
                      ),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(
                        noSpousalScenario,
                        'exSpousalSupport.childExpenses.monthlySupport',
                        0,
                      ),
                    ).format('($0,0')}
                  </td>
                </React.Fragment>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpecialExpensesTable;
