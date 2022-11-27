/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useMemo } from 'react';

import numeral from 'numeral';

import DonutChart from 'components/charts/DonutChart';
import BarChart from 'components/charts/BarChart';
import CardHeader from 'components/calculations/components/CardHeader';

import toUSD from 'utils/toUSD';
import customGet from 'utils/get';

const childSupportLabels = ['Child Support', 'Remaining Income'];

const chartOptions = {
  maintainAspectRatio: false,
  scales: {
    xAxes: [
      {
        offset: true,
      },
    ],
  },
};

const format = (obj, path) => numeral(customGet(obj, path, 0)).format('($0,0');

const ChildSupportS3 = ({
  supportCalculation,
  agreedChildSupport,
  agreedChildSupportDonut,
  allChildSupport,
  childSupport,
  clientName,
  exName,
  index,
}) => {
  const clientGuidelineIncome = useMemo(
    () => customGet(childSupport, 'clientChildSupport.guidelineIncome'),
    [childSupport],
  );
  const exGuidelineIncome = useMemo(
    () => customGet(childSupport, 'exChildSupport.guidelineIncome'),
    [childSupport],
  );
  const clientTotalIncome = useMemo(
    () =>
      customGet(
        supportCalculation,
        'calculationResult.spousalSupport.scenarios[3].clientSpousalSupport.income.total',
        0,
      ),
    [supportCalculation],
  );
  const exTotalIncome = useMemo(
    () =>
      customGet(
        supportCalculation,
        'calculationResult.spousalSupport.scenarios[3].exSpousalSupport.income.total',
        0,
      ),
    [supportCalculation],
  );
  const clientCSAdjustments = useMemo(
    () =>
      clientGuidelineIncome > clientTotalIncome
        ? clientGuidelineIncome - clientTotalIncome
        : clientGuidelineIncome === clientTotalIncome
        ? 0.0
        : clientGuidelineIncome - clientTotalIncome,
    [clientGuidelineIncome, clientTotalIncome],
  );
  const exCSAdjustments = useMemo(
    () =>
      exGuidelineIncome > exTotalIncome
        ? exGuidelineIncome - exTotalIncome
        : exGuidelineIncome === exTotalIncome
        ? 0.0
        : exGuidelineIncome - exTotalIncome,
    [exGuidelineIncome, exTotalIncome],
  );

  const otherChildSupport = useMemo(
    () => !!customGet(childSupport, 'clientChildSupport.otherMonthlySupport'),
    [childSupport],
  );

  const otherChildSupportRow = useMemo(
    () =>
      otherChildSupport
        ? [
            {
              clientValue: format(childSupport, 'clientChildSupport.otherMonthlySupport'),
              exValue: format(childSupport, 'exChildSupport.otherMonthlySupport'),
              name: 'Other Child Support (Monthly)',
            },
          ]
        : [],
    [childSupport, otherChildSupport],
  );

  const rows = useMemo(
    () => [
      {
        name: 'Employment Income',
        clientValue: format(childSupport, 'clientChildSupport.employmentIncome'),
        exValue: format(childSupport, 'exChildSupport.employmentIncome'),
      },
      {
        name: 'Line 15000 Income',
        clientValue: clientTotalIncome,
        exValue: exTotalIncome,
      },
      {
        name: 'Adjustments to Guideline Income',
        clientValue: clientCSAdjustments,
        exValue: exCSAdjustments,
      },
      {
        name: 'CS Guideline Income',
        clientValue: clientGuidelineIncome,
        exValue: exGuidelineIncome,
      },
      {
        name: `Eligible Children ${otherChildSupport ? '(guideline)' : ''}`,
        clientValue: customGet(childSupport, 'clientChildSupport.tableChildren', 0),
        exValue: customGet(childSupport, 'exChildSupport.tableChildren', 0),
      },
      {
        name: 'Table Child Support (Monthly)',
        clientValue: format(childSupport, 'clientChildSupport.tableMonthlySupport'),
        exValue: format(childSupport, 'exChildSupport.tableMonthlySupport'),
      },
      ...otherChildSupportRow,
      {
        name: 'Net Child Support (Monthly)',
        clientValue: format(childSupport, 'clientChildSupport.netMonthlySupport'),
        exValue: format(childSupport, 'exChildSupport.netMonthlySupport'),
      },
    ],
    [
      childSupport,
      clientTotalIncome,
      clientCSAdjustments,
      clientGuidelineIncome,
      exTotalIncome,
      exCSAdjustments,
      exGuidelineIncome,
      otherChildSupportRow,
      otherChildSupport,
    ],
  );

  return (
    <div className='support-report-page'>
      <CardHeader
        text={`${index}. Child Support (s. 3)`}
        src='./img/icons/dusk/png/guardian.png'
        avatarContent='fixed monthly child support'
        report
      />
      <div className='calculator-section'>
        <p>
          Section 3 child support is base monthly child support paid to assist with the costs of
          raising children. Section 3 child support is payable by Person 1 to Person 2 in the
          monthly base amount shown below.
        </p>

        {agreedChildSupport !== null && (
          <div className='row doughnut-row mb-0 justify-content-start'>
            <div className='support-doughnut text-center float-left p-0 m-0 col-2'>
              <DonutChart
                data={agreedChildSupportDonut}
                labels={childSupportLabels}
                subtext='monthly'
                text={`${toUSD(agreedChildSupportDonut?.[0])}`}
                instant
              />
              <div className='mt-2'>Agreed Support</div>
            </div>
            <div className='col-sm-1- m-0 p-0 pl-5 display-block bar-row float-left'>
              <BarChart
                data={agreedChildSupportDonut}
                labels={['Agreed Support', 'Guideline Support']}
                instant
                options={chartOptions}
              />
            </div>
          </div>
        )}
        {agreedChildSupport === null && (
          <div className='row text-center doughnut-row mb-3'>
            <div className='support-doughnut text-center'>
              <DonutChart
                data={allChildSupport}
                labels={childSupportLabels}
                subtext='monthly'
                text={`${toUSD(allChildSupport?.[0])}`}
                instant
              />
              <span>Guideline Amount</span>
            </div>
            <div className='col-sm-8 m-0 p-0 pl-5 mt-5' style={{ width: '40%' }}>
              <div className='card'>
                <div className='card-body mt-0 pt-0 text-left'>
                  <p className='mt-4 mb-0'>
                    Child Support is calculated before any spousal support, based on the pre-tax
                    income of each party. Child support payments are generally not tax-deductible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <p className='clearfix'>
          Section 3 child support calculation details are in the table below.
        </p>

        <div className='row'>
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
                {rows.map(({ name, exValue, clientValue }) => (
                  <tr key={name}>
                    <th scope='row'>{name}</th>
                    <td>{clientValue}</td>
                    <td>{exValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p>
          Section 3 child support is calculated before spousal support, based on the pre-tax income
          of each party. Child support payments are generally not tax-deductible.
        </p>

        <p>
          The payor's income may increase or decrease over time. Either party may apply to the court
          to change the original order or the agreement so that the amount of child support reflects
          the payor's current income. The payor would make the application if their income has
          fallen, while the recipient would make the application when the payor's income has
          increased. To avoid a situation where parents are continually making trips back to court
          to seek an adjustment of child support, it's a good idea to include a term in the court
          order or agreement that requires both parents to regularly exchange income information,
          usually every year after taxes have been filed, so that child support can be adjusted from
          time to time without having to go to court.
        </p>

        <h6 className='mt-4'>&nbsp;</h6>
        <div className='row text-center spacer-row' />
      </div>
    </div>
  );
};

export default ChildSupportS3;
