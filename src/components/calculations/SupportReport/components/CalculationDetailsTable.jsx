/* eslint-disable jsx-a11y/control-has-associated-label */

import React from 'react';

import numeral from 'numeral';

import GroupedBarChart from 'components/charts/GroupedBarChart';

import customGet from 'utils/get';

const CalculationDetailsTable = ({
  spousalSupport,
  clientName,
  exName,
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

  const clientData = [
    Math.round(customGet(firstScenario, 'clientSpousalSupport.monthlyIndi', 0)),
    Math.round(customGet(secondScenario, 'clientSpousalSupport.monthlyIndi', 0)),
    Math.round(customGet(thirdScenario, 'clientSpousalSupport.monthlyIndi', null)),
  ];
  const exData = [
    Math.round(customGet(firstScenario, 'exSpousalSupport.monthlyIndi', 0)),
    Math.round(customGet(secondScenario, 'exSpousalSupport.monthlyIndi', 0)),
    Math.round(customGet(thirdScenario, 'exSpousalSupport.monthlyIndi', null)),
  ];

  return (
    <div className='row no-gutters'>
      <div className='col-12'>
        <div className='td-doughnut-chart' />
        {agreedSpousalSupport ? (
          <div className='td-bar-chart ml-auto'>
            <GroupedBarChart
              data1={clientData}
              data2={exData}
              labels={['Agreed Spousal', 'Low Spousal', 'High Spousal']}
              instant
              displayClass='grouped-chart-details-container'
            />
          </div>
        ) : (
          <div className='td-bar-chart ml-auto'>
            <GroupedBarChart
              data1={clientData}
              data2={exData}
              labels={['Low Spousal', 'Mid Spousal', 'High Spousal']}
              instant
              displayClass='grouped-chart-details-container'
            />
          </div>
        )}
        <table className='table table-striped'>
          <thead>
            <tr>
              <th scope='col' />
              <th scope='col'>{clientName}</th>
              <th scope='col'>{exName}</th>
              <th scope='col' className='table-middle'>
                {clientName}
              </th>
              <th scope='col' className='table-middle'>
                {exName}
              </th>
              <th scope='col'>{clientName}</th>
              <th scope='col'>{exName}</th>
            </tr>
          </thead>

          {/* eslint-disable */}

          <tbody>
            <tr>
              <th scope='row'>Guideline Income (Annual)</th>
              <td>
                {numeral(
                  customGet(firstScenario, 'clientSpousalSupport.monthlyGuidelineIncome', 0) * 12,
                ).format('($0,0')}
              </td>
              <td>
                {numeral(
                  customGet(firstScenario, 'exSpousalSupport.monthlyGuidelineIncome', 0) * 12,
                ).format('($0,0')}
              </td>
              <td className='table-middle'>
                {numeral(
                  customGet(secondScenario, 'clientSpousalSupport.monthlyGuidelineIncome', 0) * 12,
                ).format('($0,0')}
              </td>
              <td className='table-middle'>
                {numeral(
                  customGet(secondScenario, 'exSpousalSupport.monthlyGuidelineIncome', 0) * 12,
                ).format('($0,0')}
              </td>
              <td>
                {numeral(
                  customGet(thirdScenario, 'clientSpousalSupport.monthlyGuidelineIncome', 0) * 12,
                ).format('($0,0')}
              </td>
              <td>
                {numeral(
                  customGet(thirdScenario, 'exSpousalSupport.monthlyGuidelineIncome', 0) * 12,
                ).format('($0,0')}
              </td>
            </tr>
            <tr>
              <th scope='row'>Guideline Income (Monthly)</th>
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
            </tr>
            <tr>
              <th scope='row'>Spousal Support</th>
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
            </tr>
            {showChildSupportResults && (
              <React.Fragment>
                <tr>
                  <th scope='row'>Child Support (Table)</th>
                  <td>
                    {numeral(
                      customGet(
                        firstScenario,
                        'clientSpousalSupport.formulaMonthlyChildSupportTable',
                        0,
                      ) * -1,
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(
                        firstScenario,
                        'exSpousalSupport.formulaMonthlyChildSupportTable',
                        0,
                      ) * -1,
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(
                        secondScenario,
                        'clientSpousalSupport.formulaMonthlyChildSupportTable',
                        0,
                      ) * -1,
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(
                        secondScenario,
                        'exSpousalSupport.formulaMonthlyChildSupportTable',
                        0,
                      ) * -1,
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(
                        thirdScenario,
                        'clientSpousalSupport.formulaMonthlyChildSupportTable',
                        0,
                      ) * -1,
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(
                        thirdScenario,
                        'exSpousalSupport.formulaMonthlyChildSupportTable',
                        0,
                      ) * -1,
                    ).format('($0,0')}
                  </td>
                </tr>
                <tr>
                  <th scope='row'>Child Support (Notional)</th>
                  <td>
                    {numeral(
                      customGet(
                        firstScenario,
                        'clientSpousalSupport.formulaMonthlyChildSupportNotional).',
                        0,
                      ) * -1,
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(
                        firstScenario,
                        'exSpousalSupport.formulaMonthlyChildSupportNotional).',
                        0,
                      ) * -1,
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(
                        secondScenario,
                        'clientSpousalSupport.formulaMonthlyChildSupportNotional).',
                        0,
                      ) * -1,
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(
                        secondScenario,
                        'exSpousalSupport.formulaMonthlyChildSupportNotional).',
                        0,
                      ) * -1,
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(
                        thirdScenario,
                        'clientSpousalSupport.formulaMonthlyChildSupportNotional).',
                        0,
                      ) * -1,
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(
                        thirdScenario,
                        'exSpousalSupport.formulaMonthlyChildSupportNotional).',
                        0,
                      ) * -1,
                    ).format('($0,0')}
                  </td>
                </tr>
                <tr>
                  <th scope='row'>Child Support (s. 7)</th>
                  <td>
                    {numeral(
                      customGet(
                        firstScenario,
                        'clientSpousalSupport.childExpenses.monthlySupport',
                        0,
                      ) * -1,
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(firstScenario, 'exSpousalSupport.childExpenses.monthlySupport', 0) *
                        -1,
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(
                        secondScenario,
                        'clientSpousalSupport.childExpenses.monthlySupport',
                        0,
                      ) * -1,
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(
                        secondScenario,
                        'exSpousalSupport.childExpenses.monthlySupport',
                        0,
                      ) * -1,
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(
                        thirdScenario,
                        'clientSpousalSupport.childExpenses.monthlySupport',
                        0,
                      ) * -1,
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(thirdScenario, 'exSpousalSupport.childExpenses.monthlySupport', 0) *
                        -1,
                    ).format('($0,0')}
                  </td>
                </tr>
                <tr>
                  <th scope='row'>Special Expenses (s. 7)</th>
                  <td>
                    {numeral(
                      customGet(
                        firstScenario,
                        'clientSpousalSupport.childExpenses.monthlyPaid',
                        0,
                      ) * -1,
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(firstScenario, 'exSpousalSupport.childExpenses.monthlyPaid', 0) *
                        -1,
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(
                        secondScenario,
                        'clientSpousalSupport.childExpenses.monthlyPaid',
                        0,
                      ) * -1,
                    ).format('($0,0')}
                  </td>
                  <td className='table-middle'>
                    {numeral(
                      customGet(secondScenario, 'exSpousalSupport.childExpenses.monthlyPaid', 0) *
                        -1,
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(
                        thirdScenario,
                        'clientSpousalSupport.childExpenses.monthlyPaid',
                        0,
                      ) * -1,
                    ).format('($0,0')}
                  </td>
                  <td>
                    {numeral(
                      customGet(thirdScenario, 'exSpousalSupport.childExpenses.monthlyPaid', 0) *
                        -1,
                    ).format('($0,0')}
                  </td>
                </tr>
              </React.Fragment>
            )}
            <tr>
              <th scope='row'>Taxes & Deductions</th>
              <td>
                {numeral(customGet(firstScenario, 'clientSpousalSupport.monthlyTax') * -1).format(
                  '($0,0',
                )}
              </td>
              <td>
                {numeral(customGet(firstScenario, 'exSpousalSupport.monthlyTax') * -1).format(
                  '($0,0',
                )}
              </td>
              <td className='table-middle'>
                {numeral(customGet(secondScenario, 'clientSpousalSupport.monthlyTax') * -1).format(
                  '($0,0',
                )}
              </td>
              <td className='table-middle'>
                {numeral(customGet(secondScenario, 'exSpousalSupport.monthlyTax') * -1).format(
                  '($0,0',
                )}
              </td>
              <td>
                {numeral(customGet(thirdScenario, 'clientSpousalSupport.monthlyTax') * -1).format(
                  '($0,0',
                )}
              </td>
              <td>
                {numeral(customGet(thirdScenario, 'exSpousalSupport.monthlyTax') * -1).format(
                  '($0,0',
                )}
              </td>
            </tr>
            <tr>
              <th scope='row'>Benefits & Credits</th>
              <td>
                {numeral(
                  customGet(firstScenario, 'clientSpousalSupport.monthlyBenefits', 0),
                ).format('($0,0')}
              </td>
              <td>
                {numeral(customGet(firstScenario, 'exSpousalSupport.monthlyBenefits', 0)).format(
                  '($0,0',
                )}
              </td>
              <td className='table-middle'>
                {numeral(
                  customGet(secondScenario, 'clientSpousalSupport.monthlyBenefits', 0),
                ).format('($0,0')}
              </td>
              <td className='table-middle'>
                {numeral(customGet(secondScenario, 'exSpousalSupport.monthlyBenefits', 0)).format(
                  '($0,0',
                )}
              </td>
              <td>
                {numeral(
                  customGet(thirdScenario, 'clientSpousalSupport.monthlyBenefits', 0),
                ).format('($0,0')}
              </td>
              <td>
                {numeral(customGet(thirdScenario, 'exSpousalSupport.monthlyBenefits', 0)).format(
                  '($0,0',
                )}
              </td>
            </tr>
            <tr>
              <th scope='row'>Net Disposable Income ($)</th>
              <td>
                {numeral(customGet(firstScenario, 'clientSpousalSupport.monthlyIndi', 0)).format(
                  '($0,0',
                )}
              </td>
              <td>
                {numeral(customGet(firstScenario, 'exSpousalSupport.monthlyIndi', 0)).format(
                  '($0,0',
                )}
              </td>
              <td className='table-middle'>
                {numeral(customGet(secondScenario, 'clientSpousalSupport.monthlyIndi', 0)).format(
                  '($0,0',
                )}
              </td>
              <td className='table-middle'>
                {numeral(customGet(secondScenario, 'exSpousalSupport.monthlyIndi', 0)).format(
                  '($0,0',
                )}
              </td>
              <td>
                {numeral(customGet(thirdScenario, 'clientSpousalSupport.monthlyIndi', 0)).format(
                  '($0,0',
                )}
              </td>
              <td>
                {numeral(customGet(thirdScenario, 'exSpousalSupport.monthlyIndi', 0)).format(
                  '($0,0',
                )}
              </td>
            </tr>
            <tr>
              <th scope='row'>Net Disposable Income (%)</th>
              <td>
                {numeral(customGet(firstScenario, 'clientSpousalSupport.percentIndi', 0)).format(
                  '00.00%',
                )}
              </td>
              <td>
                {numeral(customGet(firstScenario, 'exSpousalSupport.percentIndi', 0)).format(
                  '00.00%',
                )}
              </td>
              <td className='table-middle'>
                {numeral(customGet(secondScenario, 'clientSpousalSupport.percentIndi', 0)).format(
                  '00.00%',
                )}
              </td>
              <td className='table-middle'>
                {numeral(customGet(secondScenario, 'exSpousalSupport.percentIndi', 0)).format(
                  '00.00%',
                )}
              </td>
              <td>
                {numeral(customGet(thirdScenario, 'clientSpousalSupport.percentIndi', 0)).format(
                  '00.00%',
                )}
              </td>
              <td>
                {numeral(customGet(thirdScenario, 'exSpousalSupport.percentIndi', 0)).format(
                  '00.00%',
                )}
              </td>
            </tr>
            <tr>
              <th scope='row'>Net Support (After Tax)</th>
              <td>
                {numeral(
                  customGet(firstScenario, 'clientSpousalSupport.monthlyCostSpousalSupport', 0),
                ).format('($0,0')}
              </td>
              <td>
                {numeral(
                  customGet(firstScenario, 'exSpousalSupport.monthlyCostSpousalSupport', 0),
                ).format('($0,0')}
              </td>
              <td className='table-middle'>
                {numeral(
                  customGet(secondScenario, 'clientSpousalSupport.monthlyCostSpousalSupport', 0),
                ).format('($0,0')}
              </td>
              <td className='table-middle'>
                {numeral(
                  customGet(secondScenario, 'exSpousalSupport.monthlyCostSpousalSupport', 0),
                ).format('($0,0')}
              </td>
              <td>
                {numeral(
                  customGet(thirdScenario, 'clientSpousalSupport.monthlyCostSpousalSupport', 0),
                ).format('($0,0')}
              </td>
              <td>
                {numeral(
                  customGet(thirdScenario, 'exSpousalSupport.monthlyCostSpousalSupport', 0),
                ).format('($0,0')}
              </td>
            </tr>
            <tr>
              <th scope='row'>Lump Sum*</th>
              <td>
                {numeral(
                  customGet(firstScenario, 'clientSpousalSupport.npvSpousalSupport', 0),
                ).format('($0,0')}
              </td>
              <td>
                {numeral(customGet(firstScenario, 'exSpousalSupport.npvSpousalSupport', 0)).format(
                  '($0,0',
                )}
              </td>
              <td className='table-middle'>
                {numeral(
                  customGet(secondScenario, 'clientSpousalSupport.npvSpousalSupport', 0),
                ).format('($0,0')}
              </td>
              <td className='table-middle'>
                {numeral(customGet(secondScenario, 'exSpousalSupport.npvSpousalSupport', 0)).format(
                  '($0,0',
                )}
              </td>
              <td>
                {numeral(
                  customGet(thirdScenario, 'clientSpousalSupport.npvSpousalSupport', 0),
                ).format('($0,0')}
              </td>
              <td>
                {numeral(customGet(thirdScenario, 'exSpousalSupport.npvSpousalSupport', 0)).format(
                  '($0,0',
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CalculationDetailsTable;
