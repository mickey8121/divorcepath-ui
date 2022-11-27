/* eslint-disable jsx-a11y/control-has-associated-label */

import React from 'react';

import numeral from 'numeral';

import GroupedBarChart from 'components/charts/GroupedBarChart';
import DonutChart from 'components/charts/DonutChart';
import BarChart from 'components/charts/BarChart';

import calc from 'utils/calc';
import customGet from 'utils/get';
import toUSD from 'utils/toUSD';

const TotalSupportTable = ({
  spousalSupport,
  clientName,
  exName,
  showSpousalSupport,
  agreedSpousalSupport,
  showChildSupportResults,
}) => {
  const firstScenario = agreedSpousalSupport
    ? spousalSupport?.scenarios[4]
    : spousalSupport?.scenarios[0];
  const secondScenario = agreedSpousalSupport
    ? spousalSupport?.scenarios[0]
    : spousalSupport?.scenarios[1];
  const thirdScenario = spousalSupport?.scenarios[2];
  const noSpousalScenario = spousalSupport?.scenarios[3];

  const chartLabels = agreedSpousalSupport
    ? ['Net Income Agreed Spousal', 'Net Income Low Spousal', 'Net Income High Spousal']
    : ['Net Income Low Spousal', 'Net Income Mid Spousal', 'Net Income High Spousal'];

  let clientData = [];
  let exData = [];
  // let donutData=[]
  let barData = [];

  if (showSpousalSupport) {
    clientData = [
      Math.round(customGet(firstScenario, 'clientSpousalSupport.monthlyIncomeNetSupport', 1)),
      Math.round(customGet(secondScenario, 'clientSpousalSupport.monthlyIncomeNetSupport', 1)),
      Math.round(customGet(thirdScenario, 'clientSpousalSupport.monthlyIncomeNetSupport', 1)),
    ];
    exData = [
      Math.round(customGet(firstScenario, 'exSpousalSupport.monthlyIncomeNetSupport', 1)),
      Math.round(customGet(secondScenario, 'exSpousalSupport.monthlyIncomeNetSupport', 1)),
      Math.round(customGet(thirdScenario, 'exSpousalSupport.monthlyIncomeNetSupport', 1)),
    ];
  } else {
    clientData = [
      Math.round(customGet(noSpousalScenario, 'clientSpousalSupport.monthlyIncomeNetSupport', 1)),
    ];
    exData = [
      Math.round(customGet(noSpousalScenario, 'exSpousalSupport.monthlyIncomeNetSupport', 1)),
    ];
    barData = [Math.round(clientData), Math.round(exData)];
    // donutData = (barData[0] === 0 && barData[1] === 0 ? [1,1] : barData)
  }

  if (clientData[0] === 0 && exData[0] === 0) {
    clientData = [1, 1, 1];
    exData = [1, 1, 1];
  }

  // const totalSupportLables = ['Spousal Support', 's.3 Child Support', 's.7 Child Support']
  const totalSupportData = calc(
    noSpousalScenario,
    spousalSupport?.payor,
    'monthlySpousalSupport',
    'monthlyChildSupportNet',
    'childExpenses.monthlySupport',
  );

  const totalSupport = totalSupportData.filter(s => s).length ? totalSupportData : [1, 1];

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
          <div className='d-flex'>
            <div className='td-doughnut-chart'>
              <div style={{ width: '70%', paddingTop: 20, margin: '4%', display: 'inline-block' }}>
                <strong className='mb-2'>Total Support</strong>
                <DonutChart
                  data={totalSupport}
                  subtext='monthly'
                  instant
                  text={toUSD(
                    Math.abs(
                      customGet(noSpousalScenario, 'clientSpousalSupport.monthlyTotalSupport', 1),
                    ),
                  )}
                />
              </div>
            </div>
            <div
              className='td-bar-chart'
              style={{ width: '25%', paddingTop: 30, margin: '0%', display: 'inline-block' }}
            >
              <strong className='mb-2'>Net Income</strong>
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
          <tbody>
            <tr>
              <th scope='row'>Monthly Guideline Income</th>
              {/* eslint-disable */}
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
            {showSpousalSupport && (
              <tr>
                <th scope='row'>Spousal Support</th>
                <React.Fragment>
                  <td>
                    {numeral(
                      customGet(firstScenario, 'clientSpousalSupport.monthlySpousalSupport', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(firstScenario, 'exSpousalSupport.monthlySpousalSupport', 0),
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(secondScenario, 'clientSpousalSupport.monthlySpousalSupport', 0),
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(secondScenario, 'exSpousalSupport.monthlySpousalSupport', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(thirdScenario, 'clientSpousalSupport.monthlySpousalSupport', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(thirdScenario, 'exSpousalSupport.monthlySpousalSupport', 0),
                    ).format('($0,0')}
                  </td>
                </React.Fragment>
              </tr>
            )}
            {showChildSupportResults && (
              <React.Fragment>
                <tr>
                  <th scope='row'> Child Support (s.3)</th>
                  {showSpousalSupport ? (
                    <React.Fragment>
                      <td>
                        {numeral(
                          customGet(
                            firstScenario,
                            'clientSpousalSupport.monthlyChildSupportNet',
                            0,
                          ),
                        ).format('($0,0')}
                      </td>
                      <td>
                        {numeral(
                          customGet(firstScenario, 'exSpousalSupport.monthlyChildSupportNet', 0),
                        ).format('($0,0')}
                      </td>
                      <td className='table-middle'>
                        {numeral(
                          customGet(
                            secondScenario,
                            'clientSpousalSupport.monthlyChildSupportNet',
                            0,
                          ),
                        ).format('($0,0')}
                      </td>
                      <td className='table-middle'>
                        {numeral(
                          customGet(secondScenario, 'exSpousalSupport.monthlyChildSupportNet', 0),
                        ).format('($0,0')}
                      </td>
                      <td>
                        {numeral(
                          customGet(
                            thirdScenario,
                            'clientSpousalSupport.monthlyChildSupportNet',
                            0,
                          ),
                        ).format('($0,0')}
                      </td>
                      <td>
                        {numeral(
                          customGet(thirdScenario, 'exSpousalSupport.monthlyChildSupportNet', 0),
                        ).format('($0,0')}
                      </td>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <td>
                        {numeral(
                          customGet(
                            noSpousalScenario,
                            'clientSpousalSupport.monthlyChildSupportNet',
                            0,
                          ),
                        ).format('($0,0')}
                      </td>
                      <td>
                        {numeral(
                          customGet(
                            noSpousalScenario,
                            'exSpousalSupport.monthlyChildSupportNet',
                            0,
                          ),
                        ).format('($0,0')}
                      </td>
                    </React.Fragment>
                  )}
                </tr>
                <tr>
                  <th scope='row'> Child Support (s.7)</th>
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
                          customGet(
                            firstScenario,
                            'exSpousalSupport.childExpenses.monthlySupport',
                            0,
                          ),
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
                          customGet(
                            secondScenario,
                            'exSpousalSupport.childExpenses.monthlySupport',
                            0,
                          ),
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
                          customGet(
                            thirdScenario,
                            'exSpousalSupport.childExpenses.monthlySupport',
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
              </React.Fragment>
            )}
            {showChildSupportResults && (
              <tr>
                <th scope='row'>Total Support</th>
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
            )}
            <tr>
              <th scope='row'>Gross Income With Support</th>
              {showSpousalSupport ? (
                <React.Fragment>
                  <td>
                    {numeral(
                      customGet(firstScenario, 'clientSpousalSupport.monthlyIncomeNetSupport', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(firstScenario, 'exSpousalSupport.monthlyIncomeNetSupport', 0),
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(secondScenario, 'clientSpousalSupport.monthlyIncomeNetSupport', 0),
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(secondScenario, 'exSpousalSupport.monthlyIncomeNetSupport', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(thirdScenario, 'clientSpousalSupport.monthlyIncomeNetSupport', 0),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(thirdScenario, 'exSpousalSupport.monthlyIncomeNetSupport', 0),
                    ).format('($0,0')}
                  </td>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <td>
                    {numeral(
                      customGet(
                        noSpousalScenario,
                        'clientSpousalSupport.monthlyIncomeNetSupport',
                        0,
                      ),
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(noSpousalScenario, 'exSpousalSupport.monthlyIncomeNetSupport', 0),
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

export default TotalSupportTable;
