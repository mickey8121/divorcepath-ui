import React, { useMemo } from 'react';

import { Link } from 'react-router-dom';

import CardHeader from 'components/calculations/components/CardHeader';
import DonutChart from 'components/charts/DonutChart';
import TotalSupportTable from 'components/calculations/SupportReport/components/TotalSupportTable';

import toRoundUSD from 'utils/toRoundUSD';
import customGet from 'utils/get';

const rangeLabels = ['Spousal Support', 'Remaining Income'];
const totalSupportLabels = ['Spousal Support', 's.3 Child Support', 's.7 Child Support'];

const format = (obj, path) => toRoundUSD(customGet(obj, path, 0));

const Total = ({
  showSpousalSupport,
  showChildSupportResults,
  payeeName,
  agreedSpousalSupport,
  agreedSpousalSpecialExpenses,
  scenarios,
  lowTotalSupport,
  midTotalSupport,
  highTotalSupport,
  spousalSupport,
  exSupportProfile,
  clientSupportProfile,
  index,
}) => {
  const charts = useMemo(
    () =>
      [
        !!agreedSpousalSupport && {
          data: agreedSpousalSpecialExpenses,
          text: format(scenarios?.[4], 'exSpousalSupport.monthlyTotalSupport'),
          className: 'mb-4',
          labels: rangeLabels,
          description: 'Agreed Amount',
        },
        {
          data: lowTotalSupport,
          text: format(scenarios?.[0], 'exSpousalSupport.monthlyTotalSupport'),
          labels: totalSupportLabels,
          description: 'Low-Range',
        },
        !agreedSpousalSupport && {
          data: midTotalSupport,
          text: format(scenarios?.[1], 'exSpousalSupport.monthlyTotalSupport'),
          labels: totalSupportLabels,
          description: 'Mid-Range',
        },
        {
          data: highTotalSupport,
          text: format(scenarios?.[2], 'exSpousalSupport.monthlyTotalSupport'),
          labels: totalSupportLabels,
          description: 'High-Range',
        },
      ].filter(c => c),
    [
      agreedSpousalSpecialExpenses,
      agreedSpousalSupport,
      lowTotalSupport,
      midTotalSupport,
      highTotalSupport,
      scenarios,
    ],
  );

  return (
    <div className='support-report-page'>
      <CardHeader
        text={`${index}. Total Support`}
        src='./img/icons/dusk/png/money-box.png'
        avatarContent='child support + spousal support'
        report
      />

      <div className='calculator-section'>
        {showSpousalSupport && <h6>Total Support Ranges</h6>}

        <p>
          {`The charts below show the monthly total child ${
            showSpousalSupport ? ' and spousal' : ''
          } support payable by to ${payeeName} ${
            showSpousalSupport ? ' in each spousal support scenario' : ''
          }.`}
        </p>

        {showSpousalSupport && (
          <React.Fragment>
            <div className='row text-center doughnut-row'>
              {charts.map(({ description, ...chart }) => (
                <div className='support-doughnut text-center' key={description}>
                  <DonutChart instant subtext='monthly' {...chart} />
                  <span>{description}</span>
                </div>
              ))}
            </div>

            <p className='mt-3'>
              A more detailed breakdown of total support payments is shown in the table below.
            </p>
            <h6>Total Support Details</h6>
            <p>
              Calculation details for each of the low, mid and high support scenarios are set out in
              the table below.
            </p>
          </React.Fragment>
        )}

        <TotalSupportTable
          spousalSupport={spousalSupport}
          clientName={clientSupportProfile?.firstName}
          exName={exSupportProfile?.firstName}
          showSpousalSupport={showSpousalSupport}
          showChildSupportResults={showChildSupportResults}
          agreedSpousalSupport={agreedSpousalSupport}
        />
        <p>
          For more information on how to adjust total support to account for special circumstances
          such as hardship or changes in circumstances, read our{' '}
          <Link to='/'>guide to adjusting support obligations</Link>.
        </p>
      </div>
    </div>
  );
};

export default Total;
