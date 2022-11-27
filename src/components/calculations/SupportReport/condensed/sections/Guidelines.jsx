/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useMemo } from 'react';

import numeral from 'numeral';

import DonutChart from 'components/charts/DonutChart';

import toUSD from 'utils/toUSD';
import customGet from 'utils/get';
import calc from 'utils/calc';

const rangeLabels = ['Spousal Support', 'Remaining Income'];

const format = (obj, path) => numeral(customGet(obj, path, 0)).format('($0,0');

const Guidelines = ({
  supportCalculation,
  showChildSupportResults,
  childSupport,
  clientFirstName,
  exFirstName,
  childExpenses,
  showSpousalSupport,
  agreedSpousalSupport,
  spousalSupport,
  formula,
  scenarios,
  payor,
}) => {
  const [lowSpousalSupport, midSpousalSupport, highSpousalSupport, agreedSpousalSupportScenario] =
    useMemo(
      () =>
        scenarios
          .slice(0, 4)
          .map(scenario =>
            calc(scenario, `${payor}SpousalSupport`, 'monthlySpousalSupport', 'monthlyCash'),
          ),
      [payor, scenarios],
    );

  const indefiniteDuration = spousalSupport?.minDuration > 99;

  const otherChildSupport = useMemo(
    () => !!customGet(childSupport, 'clientChildSupport.otherMonthlySupport'),
    [childSupport],
  );

  const otherChildSupportBlock = useMemo(
    () =>
      otherChildSupport
        ? [
            {
              client: format(childSupport, 'clientChildSupport.otherMonthlySupport'),
              ex: format(childSupport, 'exChildSupport.otherMonthlySupport'),
              name: 'Other Child Support (Monthly)',
            },
            {
              name: 'Net Child Support (Monthly)',
              client: format(childSupport, 'clientChildSupport.netMonthlySupport'),
              ex:
                customGet(childSupport, 'exChildSupport.netMonthlySupport') < 0
                  ? format(childSupport, 'exChildSupport.netMonthlySupport')
                  : '0',
            },
          ]
        : [],
    [childSupport, otherChildSupport],
  );

  const childGuidelines = useMemo(
    () =>
      [
        {
          name: 'Annual Guideline Income',
          client: format(childSupport, 'clientChildSupport.guidelineIncome'),
          ex: format(childSupport, 'exChildSupport.guidelineIncome'),
        },
        {
          name: 'CSG Table Amount (current)',
          client: format(childSupport, 'clientChildSupport.tableMonthlySupport'),
          ex: format(childSupport, 'exChildSupport.tableMonthlySupport'),
        },
        ...otherChildSupportBlock,
        {
          name: 'Child Support (Net)',
          client: format(childSupport, 'clientChildSupport.netMonthlySupport'),
          ex: format(childSupport, 'exChildSupport.netMonthlySupport'),
        },
        childExpenses.length > 0 && {
          name: 'Special Expenses (s. 7 Net Paid)',
          client: format(scenarios[0], 'clientSpousalSupport.childExpenses.netPaid', 0),
          ex: format(scenarios[0], 'exSpousalSupport.childExpenses.netPaid', 0),
        },
      ].filter(c => c),
    [childExpenses, childSupport, otherChildSupportBlock, scenarios],
  );

  const charts = useMemo(
    () =>
      [
        !!agreedSpousalSupport && {
          wrapperClassName: 'condensed-doughnut text-center',
          data: agreedSpousalSupportScenario,
          text: `${toUSD(supportCalculation?.agreedSpousalSupport)}`,
          className: 'mb-4',
          description: 'Agreed',
        },
        {
          wrapperClassName: 'condensed-doughnut text-center',
          data: lowSpousalSupport,
          text: `${toUSD(lowSpousalSupport?.[0])}`,
          className: 'mb-4',
          description: 'Low',
        },
        !agreedSpousalSupport && {
          wrapperClassName: 'condensed-doughnut',
          data: midSpousalSupport,
          text: `${toUSD(midSpousalSupport?.[0])}`,
          description: 'Mid',
        },
        {
          wrapperClassName: 'condensed-doughnut',
          data: highSpousalSupport,
          text: `${toUSD(highSpousalSupport?.[0])}`,
          description: 'High',
        },
      ].filter(c => c),
    [
      agreedSpousalSupport,
      agreedSpousalSupportScenario,
      supportCalculation,
      lowSpousalSupport,
      midSpousalSupport,
      highSpousalSupport,
    ],
  );

  const minDuration = customGet(spousalSupport, 'minDuration');
  const maxDuration = customGet(spousalSupport, 'maxDuration');

  const lowWonthlySpousalSupport = format(
    spousalSupport,
    'scenarios.0.clientSpousalSupport.monthlySpousalSupport',
  );
  const highMonthlySpousalSupport = format(
    spousalSupport,
    'scenarios.2.clientSpousalSupport.monthlySpousalSupport',
  );

  const indefiniteDurationDesc = indefiniteDuration
    ? ' for an indefinite (unspecified) duration, subject to review and possibly variation'
    : ` for a minimum duration of ${minDuration} years and a maximum
  duration of ${maxDuration} years from the date of separation, subject to review and possibly variation`;

  const text = `
    The formula results in a range for spousal support of 
    ${lowWonthlySpousalSupport} to ${highMonthlySpousalSupport} per month
    ${indefiniteDurationDesc}.
  `;

  return (
    <div className='col-6'>
      {showChildSupportResults && (
        <React.Fragment>
          <div className='bg-dark p-2'>
            <h6 className='text-white mb-0'>
              <strong>Child Support Guidelines (CSG)</strong>
            </h6>
          </div>

          <table className='table table-striped'>
            <thead>
              <tr>
                <th scope='col' />
                <th scope='col'>
                  <em>{clientFirstName}</em>
                </th>
                <th scope='col'>
                  <em>{exFirstName}</em>
                </th>
              </tr>
            </thead>
            <tbody>
              {childGuidelines.map(({ name, client, ex }) => (
                <tr key={name}>
                  <th scope='row'>{name}</th>
                  <td>{client}</td>
                  <td>{ex}</td>
                </tr>
              ))}
              {childExpenses.length > 0 && (
                <tr>
                  <th scope='row'>Child Support (s. 7 Payment)</th>
                  <td colSpan='2'>Support Scenarios (below)</td>
                </tr>
              )}
            </tbody>
          </table>
        </React.Fragment>
      )}

      {showSpousalSupport && (
        <React.Fragment>
          <div className='bg-dark p-2 mb-3'>
            <h6 className='text-white mb-0'>
              <strong>Spousal Support Advisory Guidelines (SSAG)</strong>
            </h6>
          </div>

          <p>
            <small>
              Length of marriage or cohabitation:{' '}
              {customGet(spousalSupport, 'durationOfRelationship')} years
            </small>
            <br />
            <small>
              Recipient's age at separation: {customGet(spousalSupport, 'ageAtSeparation')} years
            </small>
          </p>

          <p>
            <strong>{formula} Formula:</strong>
          </p>

          <div
            className='row text-center doughnut-row mb-3'
            style={{ height: 200, width: 450, marginLeft: 0, marginBottom: -20 }}
          >
            {charts.map(({ wrapperClassName, description, ...chart }) => (
              <div key={description} className={wrapperClassName}>
                <DonutChart {...chart} labels={rangeLabels} instant />
                <small className='text-muted'>{description}</small>
              </div>
            ))}
          </div>
          <p style={{ marginTop: -60 }}>{text}</p>
        </React.Fragment>
      )}
    </div>
  );
};

export default Guidelines;
