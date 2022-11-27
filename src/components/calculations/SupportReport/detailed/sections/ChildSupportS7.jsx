import React, { useMemo } from 'react';

import { Link } from 'react-router-dom';

import CardHeader from 'components/calculations/components/CardHeader';
import DonutChart from 'components/charts/DonutChart';
import SpecialExpensesTable from 'components/calculations/SupportReport/components/SpecialExpensesTable';

import toRoundUSD from 'utils/toRoundUSD';
import customGet from 'utils/get';

const rangeLabels = ['Spousal Support', 'Remaining Income'];

const format = (obj, path) => toRoundUSD(customGet(obj, path, 0));

const ChildSupportS7 = ({
  showSpousalSupport,
  agreedSpousalSupport,
  agreedSpousalSpecialExpenses,
  spousalSupport,
  clientSupportProfile,
  exSupportProfile,
  scenarios,
  payor,
  payee,
  index,
}) => {
  const [lowSpecialExpenses, midSpecialExpenses, highSpecialExpenses] = useMemo(() => {
    const expenses = scenarios
      ?.slice(0, 3)
      ?.map(scenario => [
        customGet(scenario, `${payor}.childExpenses.share`, 0),
        customGet(scenario, `${payee}.childExpenses.share`, 0),
      ]);

    if (expenses[0]?.[0] === 0 && expenses[0]?.[1] === 0)
      return [
        [1, 1],
        [1, 1],
        [1, 1],
      ];

    return expenses;
  }, [scenarios, payee, payor]);

  const charts = useMemo(
    () =>
      [
        !!agreedSpousalSupport && {
          wrapperClassName: 'support-doughnut text-center',
          data: agreedSpousalSpecialExpenses,
          subtext: 'monthly',
          instant: true,
          text: format(spousalSupport, `scenarios.4.${payor}.childExpenses.support`),
          className: 'mb-4',
          description: 'Agreed Amount',
        },
        {
          wrapperClassName: 'support-doughnut text-center',
          data: lowSpecialExpenses,
          subtext: 'annually',
          instant: true,
          redraw: true,
          text: format(spousalSupport, `scenarios.0.${payor}.childExpenses.support`),
          className: 'mb-4',
          description: 'Low Spousal',
        },
        !agreedSpousalSupport && {
          wrapperClassName: 'support-doughnut',
          data: midSpecialExpenses,
          subtext: 'annually',
          instant: true,
          redraw: true,
          text: format(spousalSupport, `scenarios.1.${payor}.childExpenses.support`),
          className: 'mb-4',
          description: 'Mid Spousal',
        },
        {
          wrapperClassName: 'support-doughnut',
          data: highSpecialExpenses,
          subtext: 'annually',
          instant: true,
          redraw: true,
          text: format(spousalSupport, `scenarios.2.${payor}.childExpenses.support`),
          className: 'mb-4',
          description: 'High Spousal',
        },
      ].filter(c => c),
    [
      agreedSpousalSpecialExpenses,
      agreedSpousalSupport,
      lowSpecialExpenses,
      midSpecialExpenses,
      highSpecialExpenses,
      payor,
      spousalSupport,
    ],
  );

  return (
    <div className='support-report-page'>
      <CardHeader
        text={`${index}. Child Support (s. 7)`}
        src='./img/icons/dusk/png/soccer-ball.png'
        avatarContent='special child-related expenses'
        report
      />

      <div className='calculator-section'>
        <h6>Special Expense Support Ranges</h6>

        <p>
          Certain special child-related expenses are shared based on income, after adjusting for
          spousal support. The charts below show the amount of support payable in relation to
          special child-related expenses in each spousal support scenario.
        </p>

        {showSpousalSupport && (
          <React.Fragment>
            <div className='row text-center doughnut-row'>
              {charts.map(({ description, wrapperClassName, ...chart }) => (
                <div className='support-doughnut text-center' key={description}>
                  <DonutChart labels={rangeLabels} {...chart} />
                  <span>{description}</span>
                </div>
              ))}
            </div>

            <p className='mt-3'>
              For more information on how section 7 expense support is calculated, read our
              <Link to='/'> guide to section 7 expenses</Link> or review the calculation details
              below.
            </p>

            <h6>Special Expense Support Details</h6>

            <p>
              Calculation details for section 7 child support (i.e. support for special
              child-related expenses) are shown in the table below.
            </p>
          </React.Fragment>
        )}

        <SpecialExpensesTable
          spousalSupport={spousalSupport}
          clientName={clientSupportProfile?.firstName}
          exName={exSupportProfile?.firstName}
          showSpousalSupport={showSpousalSupport}
          agreedSpousalSupport={agreedSpousalSupport}
        />
      </div>
    </div>
  );
};

export default ChildSupportS7;
