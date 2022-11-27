/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useMemo } from 'react';

import numeral from 'numeral';
import classNames from 'classnames';

import GroupedBarChart from 'components/charts/GroupedBarChart';

import customGet from 'utils/get';

const formatRow = (scenario, path, isNegative) => {
  let income = customGet(scenario, path, 0);

  if (isNegative) {
    income *= -1;
  }

  return numeral(income).format('($0,0');
};

const formatPercent = (scenario, path) => {
  const income = customGet(scenario, path, 0);

  return numeral(income).format('00.00%');
};

const SupportScenariosTable = ({
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

  const chartLabels = agreedSpousalSupport
    ? ['Net Income Agreed Spousal', 'Net Income Low Spousal', 'Net Income High Spousal']
    : ['Net Income Agreed Spousal', 'Net Income Low Spousal', 'Net Income High Spousal'];

  const clientData = [
    Math.round(customGet(firstScenario, 'clientSpousalSupport.monthlyNdi', 0)),
    Math.round(customGet(secondScenario, 'clientSpousalSupport.monthlyNdi', 0)),
    Math.round(customGet(thirdScenario, 'clientSpousalSupport.monthlyNdi', null)),
  ];
  const exData = [
    Math.round(customGet(firstScenario, 'exSpousalSupport.monthlyNdi', 0)),
    Math.round(customGet(secondScenario, 'exSpousalSupport.monthlyNdi', 0)),
    Math.round(customGet(thirdScenario, 'exSpousalSupport.monthlyNdi', null)),
  ];

  const supportTableRows = useMemo(() => {
    return [
      {
        label: 'Gross Monthly Income',
        fields: [
          {
            value: formatRow(firstScenario, 'clientSpousalSupport.monthlyGuidelineIncome'),
          },
          {
            value: formatRow(firstScenario, 'exSpousalSupport.monthlyGuidelineIncome'),
          },
          {
            value: formatRow(secondScenario, 'clientSpousalSupport.monthlyGuidelineIncome'),
            isMiddle: true,
          },
          {
            value: formatRow(secondScenario, 'exSpousalSupport.monthlyGuidelineIncome'),
            isMiddle: true,
          },
          {
            value: formatRow(thirdScenario, 'clientSpousalSupport.monthlyGuidelineIncome'),
          },
          {
            value: formatRow(thirdScenario, 'exSpousalSupport.monthlyGuidelineIncome'),
          },
        ],
      },
      {
        label: 'Taxes & Deductions',
        fields: [
          {
            value: formatRow(firstScenario, 'clientSpousalSupport.monthlyTax', true),
          },
          {
            value: formatRow(firstScenario, 'exSpousalSupport.monthlyTax', true),
          },
          {
            value: formatRow(secondScenario, 'clientSpousalSupport.monthlyTax', true),
            isMiddle: true,
          },
          {
            value: formatRow(secondScenario, 'exSpousalSupport.monthlyTax', true),
            isMiddle: true,
          },
          {
            value: formatRow(thirdScenario, 'clientSpousalSupport.monthlyTax', true),
          },
          {
            value: formatRow(thirdScenario, 'exSpousalSupport.monthlyTax', true),
          },
        ],
      },
      {
        label: 'Benefits & Credits',
        fields: [
          {
            value: formatRow(firstScenario, 'clientSpousalSupport.monthlyBenefits'),
          },
          {
            value: formatRow(firstScenario, 'exSpousalSupport.monthlyBenefits'),
          },
          {
            value: formatRow(secondScenario, 'clientSpousalSupport.monthlyBenefits'),
            isMiddle: true,
          },
          {
            value: formatRow(secondScenario, 'exSpousalSupport.monthlyBenefits'),
            isMiddle: true,
          },
          {
            value: formatRow(thirdScenario, 'clientSpousalSupport.monthlyBenefits'),
          },
          {
            value: formatRow(thirdScenario, 'exSpousalSupport.monthlyBenefits'),
          },
        ],
      },
      ...(showChildSupportResults
        ? [
            {
              label: 'Special Expenses',
              fields: [
                {
                  value: formatRow(
                    firstScenario,
                    'clientSpousalSupport.childExpenses.monthlyPaid',
                    true,
                  ),
                },
                {
                  value: formatRow(
                    firstScenario,
                    'exSpousalSupport.childExpenses.monthlyPaid',
                    true,
                  ),
                },
                {
                  value: formatRow(
                    secondScenario,
                    'clientSpousalSupport.childExpenses.monthlyPaid',
                    true,
                  ),
                  isMiddle: true,
                },
                {
                  value: formatRow(
                    secondScenario,
                    'exSpousalSupport.childExpenses.monthlyPaid',
                    true,
                  ),
                  isMiddle: true,
                },
                {
                  value: formatRow(
                    thirdScenario,
                    'clientSpousalSupport.childExpenses.monthlyPaid',
                    true,
                  ),
                },
                {
                  value: formatRow(
                    thirdScenario,
                    'exSpousalSupport.childExpenses.monthlyPaid',
                    true,
                  ),
                },
              ],
            },
          ]
        : []),
      {
        label: 'Spousal Support',
        fields: [
          {
            value: formatRow(firstScenario, 'clientSpousalSupport.monthlySpousalSupport'),
          },
          {
            value: formatRow(firstScenario, 'exSpousalSupport.monthlySpousalSupport'),
          },
          {
            value: formatRow(secondScenario, 'clientSpousalSupport.monthlySpousalSupport'),
            isMiddle: true,
          },
          {
            value: formatRow(secondScenario, 'exSpousalSupport.monthlySpousalSupport'),
            isMiddle: true,
          },
          {
            value: formatRow(thirdScenario, 'clientSpousalSupport.monthlySpousalSupport'),
          },
          {
            value: formatRow(thirdScenario, 'exSpousalSupport.monthlySpousalSupport'),
          },
        ],
      },
      ...(showChildSupportResults
        ? [
            {
              label: 'Child Support (s.3)',
              fields: [
                {
                  value: formatRow(firstScenario, 'clientSpousalSupport.monthlyChildSupportNet'),
                },
                {
                  value: formatRow(firstScenario, 'exSpousalSupport.monthlyChildSupportNet'),
                },
                {
                  value: formatRow(secondScenario, 'clientSpousalSupport.monthlyChildSupportNet'),
                  isMiddle: true,
                },
                {
                  value: formatRow(secondScenario, 'exSpousalSupport.monthlyChildSupportNet'),
                  isMiddle: true,
                },
                {
                  value: formatRow(thirdScenario, 'clientSpousalSupport.monthlyChildSupportNet'),
                },
                {
                  value: formatRow(thirdScenario, 'exSpousalSupport.monthlyChildSupportNet'),
                },
              ],
            },
            {
              label: 'Child Support (s.7)',
              fields: [
                {
                  value: formatRow(
                    firstScenario,
                    'clientSpousalSupport.childExpenses.monthlySupport',
                  ),
                },
                {
                  value: formatRow(firstScenario, 'exSpousalSupport.childExpenses.monthlySupport'),
                },
                {
                  value: formatRow(
                    secondScenario,
                    'clientSpousalSupport.childExpenses.monthlySupport',
                  ),
                  isMiddle: true,
                },
                {
                  value: formatRow(secondScenario, 'exSpousalSupport.childExpenses.monthlySupport'),
                  isMiddle: true,
                },
                {
                  value: formatRow(
                    thirdScenario,
                    'clientSpousalSupport.childExpenses.monthlySupport',
                  ),
                },
                {
                  value: formatRow(thirdScenario, 'exSpousalSupport.childExpenses.monthlySupport'),
                },
              ],
            },
          ]
        : []),
      {
        label: 'Net Disposable Income',
        fields: [
          {
            value: formatRow(firstScenario, 'clientSpousalSupport.monthlyNdi'),
          },
          {
            value: formatRow(firstScenario, 'exSpousalSupport.monthlyNdi'),
          },
          {
            value: formatRow(secondScenario, 'clientSpousalSupport.monthlyNdi'),
            isMiddle: true,
          },
          {
            value: formatRow(secondScenario, 'exSpousalSupport.monthlyNdi'),
            isMiddle: true,
          },
          {
            value: formatRow(thirdScenario, 'clientSpousalSupport.monthlyNdi'),
          },
          {
            value: formatRow(thirdScenario, 'exSpousalSupport.monthlyNdi'),
          },
        ],
      },
      ...(showChildSupportResults
        ? [
            {
              label: 'Special Expenses % Share',
              fields: [
                {
                  value: formatPercent(
                    firstScenario,
                    'clientSpousalSupport.childExpenses.percentShare',
                  ),
                },
                {
                  value: formatPercent(
                    firstScenario,
                    'exSpousalSupport.childExpenses.percentShare',
                  ),
                },
                {
                  value: formatPercent(
                    secondScenario,
                    'clientSpousalSupport.childExpenses.percentShare',
                  ),
                  isMiddle: true,
                },
                {
                  value: formatPercent(
                    secondScenario,
                    'exSpousalSupport.childExpenses.percentShare',
                  ),
                  isMiddle: true,
                },
                {
                  value: formatPercent(
                    thirdScenario,
                    'clientSpousalSupport.childExpenses.percentShare',
                  ),
                },
                {
                  value: formatPercent(
                    thirdScenario,
                    'exSpousalSupport.childExpenses.percentShare',
                  ),
                },
              ],
            },
          ]
        : []),
    ];
  }, [firstScenario, secondScenario, thirdScenario, showChildSupportResults]);

  return (
    <div className='row no-gutters'>
      <div className='col-12'>
        <div className='td-doughnut-chart' />
        <div className='td-bar-chart ml-auto'>
          <GroupedBarChart
            data1={clientData}
            data2={exData}
            labels={chartLabels}
            instant
            displayClass='grouped-chart-details-container'
          />
        </div>
        <table className='table table-striped'>
          <thead>
            <tr>
              <th />
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

          <tbody>
            {supportTableRows.map(({ label, fields }) => (
              <tr key={label}>
                <th scope='row'>{label}</th>
                {fields.map(({ value, isMiddle }, index) => (
                  <td key={index} className={classNames({ 'table-middle': isMiddle })}>
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupportScenariosTable;
