/* eslint-disable react/no-unescaped-entities */
import React from 'react';

import { capitalize } from 'lodash';

import DonutChart from 'components/charts/DonutChart';

import customGet from 'utils/get';
import calc from 'utils/calc';
import toUSD from 'utils/toUSD';
import toRoundUSD from 'utils/toRoundUSD';

import SupportOverviewItem from './SupportOverviewItem';
import MonthlyBudgetCharts from './MonthlyBudgetCharts';

const format = (obj, path) => toRoundUSD(Math.round(Math.abs(customGet(obj, path, 0))));
const round = (obj, path) => toRoundUSD(Math.abs(customGet(obj, path, 0)));

const SupportOverview = ({
  supportCalculation,
  spousalSupport,
  childSupport,
  exName,
  clientName,
  showSpousalSupport,
  showChildSupportResults,
}) => {
  const scenarios = customGet(spousalSupport, 'scenarios', []);
  const formulaSpousalSupport = spousalSupport?.formula;
  const payor = spousalSupport?.payor === 'ex' ? 'exSpousalSupport' : 'clientSpousalSupport';
  const payee = spousalSupport?.payee === 'ex' ? 'exSpousalSupport' : 'clientSpousalSupport';

  const minMonthlySpousalSupport = toRoundUSD(
    Math.abs(customGet(scenarios[0], `${payor}.monthlySpousalSupport`, 0)),
  );
  const maxMonthlySpousalSupport = toRoundUSD(
    Math.abs(customGet(scenarios[2], `${payor}.monthlySpousalSupport`, 0)),
  );
  const minNetMonthlySpousalSupport = toRoundUSD(
    Math.abs(customGet(scenarios[0], `${payor}.monthlyCostSpousalSupport`, 0)),
  );
  const maxNetMonthlySpousalSupport = toRoundUSD(
    Math.abs(customGet(scenarios[2], `${payor}.monthlyCostSpousalSupport`, 0)),
  );

  const minMonthlyNetSupport = toRoundUSD(
    customGet(scenarios[0], `${payor}.monthlyChildSupportNet`, 0) +
      customGet(scenarios[0], `${payor}.monthlyCostSpousalSupport`, 0),
  );

  const maxMonthlyNetSupport = toRoundUSD(
    customGet(scenarios[2], `${payor}.monthlyChildSupportNet`, 0) +
      customGet(scenarios[2], `${payor}.monthlyCostSpousalSupport`, 0),
  );

  const formulaChildSupport = customGet(childSupport, 'formula', '');

  // const agreedChildSupport =
  //   supportCalculation?.agreedChildSupport < 0 ? null : supportCalculation?.agreedChildSupport;

  const agreedSpousalSupport =
    supportCalculation?.agreedSpousalSupport < 0 ? null : supportCalculation?.agreedSpousalSupport;

  const rangeLabels = ['Spousal Support', 'Remaining Income'];
  const childSupportLabels = ['Child Support', 'Remaining Income'];

  const agreedSpousalSupportScenario = calc(
    scenarios[4],
    payor,
    'monthlySpousalSupport',
    'monthlyCash',
  );
  const lowSpousalSupport = calc(scenarios[0], payor, 'monthlySpousalSupport', 'monthlyCash');
  const midSpousalSupport = calc(scenarios[1], payor, 'monthlySpousalSupport', 'monthlyCash');
  const highSpousalSupport = calc(scenarios[2], payor, 'monthlySpousalSupport', 'monthlyCash');

  const pathToPayorShareChildExpenses = `${payor}.childExpenses.share`;
  const pathToPayeeShareChildExpenses = `${payee}.childExpenses.share`;

  let lowSpecialExpenses = [
    customGet(scenarios[0], pathToPayorShareChildExpenses, 0),
    customGet(scenarios[0], pathToPayeeShareChildExpenses, 0),
  ];
  let midSpecialExpenses = [
    customGet(scenarios[1], pathToPayorShareChildExpenses, 0),
    customGet(scenarios[1], pathToPayeeShareChildExpenses, 0),
  ];
  let highSpecialExpenses = [
    customGet(scenarios[2], pathToPayorShareChildExpenses, 0),
    customGet(scenarios[2], pathToPayeeShareChildExpenses, 0),
  ];
  const noSpousalSpecialExpenses = [
    customGet(scenarios[3], pathToPayorShareChildExpenses, 0),
    customGet(scenarios[3], pathToPayeeShareChildExpenses, 852) || 852,
  ];

  if (lowSpecialExpenses[0] === 0 && lowSpecialExpenses[1] === 0) {
    lowSpecialExpenses = [1, 1];
    midSpecialExpenses = [1, 1];
    highSpecialExpenses = [1, 1];
  }

  const agreedTotalSupport = calc(
    scenarios[4],
    payor,
    'monthlySpousalSupport',
    'monthlyChildSupportNet',
    'childExpenses.monthlySupport',
  );
  let lowTotalSupport = calc(
    scenarios[0],
    payor,
    'monthlySpousalSupport',
    'monthlyChildSupportNet',
    'childExpenses.monthlySupport',
  );
  let midTotalSupport = calc(
    scenarios[1],
    payor,
    'monthlySpousalSupport',
    'monthlyChildSupportNet',
    'childExpenses.monthlySupport',
  );
  let highTotalSupport = calc(
    scenarios[2],
    payor,
    'monthlySpousalSupport',
    'monthlyChildSupportNet',
    'childExpenses.monthlySupport',
  );
  const noSpousalTotalSupport = calc(
    scenarios[3],
    payor,
    'monthlySpousalSupport',
    'monthlyChildSupportNet',
    'childExpenses.monthlySupport',
  );

  const totalSupport = noSpousalTotalSupport.filter(s => s).length ? noSpousalTotalSupport : [0, 1];

  if (lowTotalSupport[0] === 0 && lowTotalSupport[1] === 0) {
    lowTotalSupport = lowSpousalSupport;
    midTotalSupport = midSpousalSupport;
    highTotalSupport = highSpousalSupport;
  }

  const allChildSupport = calc(scenarios[3], payor, 'monthlyChildSupportNet', 'monthlyCash');

  const agreedSpousalSpecialExpenses = calc(scenarios[4], payor, 'childExpenses.share', 'share');

  const indefiniteDuration = spousalSupport?.minDuration > 99;

  let clientData = [
    Math.round(customGet(spousalSupport, 'scenarios.0.clientSpousalSupport.monthlyCash', 0)),
    Math.round(customGet(spousalSupport, 'scenarios.1.clientSpousalSupport.monthlyCash', 0)),
    Math.round(customGet(spousalSupport, 'scenarios.2.clientSpousalSupport.monthlyCash', null)),
  ];
  let exData = [
    Math.round(customGet(spousalSupport, 'scenarios.0.exSpousalSupport.monthlyCash', 0)),
    Math.round(customGet(spousalSupport, 'scenarios.1.exSpousalSupport.monthlyCash', 0)),
    Math.round(customGet(spousalSupport, 'scenarios.2.exSpousalSupport.monthlyCash', null)),
  ];

  if (agreedSpousalSupport) {
    clientData = [
      Math.round(customGet(spousalSupport, 'scenarios.4.clientSpousalSupport.monthlyCash', 0)),
      Math.round(customGet(spousalSupport, 'scenarios.0.clientSpousalSupport.monthlyCash', 0)),
      Math.round(customGet(spousalSupport, 'scenarios.2.clientSpousalSupport.monthlyCash', 0)),
    ];
    exData = [
      Math.round(customGet(spousalSupport, 'scenarios.4.exSpousalSupport.monthlyCash', 0)),
      Math.round(customGet(spousalSupport, 'scenarios.0.exSpousalSupport.monthlyCash', 0)),
      Math.round(customGet(spousalSupport, 'scenarios.2.exSpousalSupport.monthlyCash', 0)),
    ];
  }

  if (!showSpousalSupport) {
    clientData = [
      Math.round(customGet(spousalSupport, 'scenarios[3].clientSpousalSupport.monthlyCash', 0)),
    ];
    exData = [
      Math.round(customGet(spousalSupport, 'scenarios[3].exSpousalSupport.monthlyCash', 0)),
    ];
  }

  const clientSSGuidelineIncome = Math.round(
    customGet(spousalSupport, 'scenarios[3].clientSpousalSupport.monthlyGuidelineIncome', 0) * 12,
  );
  const exSSGuidelineIncome = Math.round(
    customGet(spousalSupport, 'scenarios[3].exSpousalSupport.monthlyGuidelineIncome', 0) * 12,
  );

  const clientCSGuidelineIncome = Math.round(
    customGet(childSupport, 'clientChildSupport.guidelineIncome', 0),
  );
  const exCSGuidelineIncome = Math.round(
    customGet(childSupport, 'exChildSupport.guidelineIncome', 0),
  );

  // console.log([clientData[2], exData[2]], clientData, exData, noSpousalTotalSupport);

  return (
    <div>
      {showSpousalSupport && (
        <SupportOverviewItem
          imageSrc='./img/icons/dusk/png/receive-cash.png'
          headerText='Spousal Support'
          headerCaption={
            <small className='d-block text-muted'>
              {`${capitalize(formulaSpousalSupport)} formula`}
            </small>
          }
          content={
            <React.Fragment>
              <h6 className='mb-0 d-inline'>
                {`${minMonthlySpousalSupport} to ${maxMonthlySpousalSupport}`}
              </h6>
              <span className='ml-2 d-inline text-muted'>
                monthly for
                {indefiniteDuration
                  ? ' an indefinite time'
                  : ` ${spousalSupport?.maxDuration} to ${spousalSupport?.minDuration} years`}
              </span>
            </React.Fragment>
          }
          secondaryContent={
            <React.Fragment>
              <h6 className='mb-0 d-inline'>
                {`${minNetMonthlySpousalSupport} to ${maxNetMonthlySpousalSupport}`}
              </h6>
              <span className='ml-2 d-inline text-muted'>
                after-tax cost to payor (more details in section 2)
              </span>
            </React.Fragment>
          }
          chart={
            <div
              className='row text-center doughnut-row'
              style={{ height: 150, width: 800, marginRight: -30 }}
            >
              {!!agreedSpousalSupport && (
                <div className='support-doughnut text-center'>
                  <DonutChart
                    data={agreedSpousalSupportScenario}
                    labels={rangeLabels}
                    instant
                    text={`${toUSD(Math.abs(agreedSpousalSupportScenario[0]))}`}
                    className='mb-4'
                  />
                  <small className='text-muted'>Agreed</small>
                </div>
              )}
              <div className='support-doughnut text-center'>
                <DonutChart
                  data={lowSpousalSupport}
                  labels={rangeLabels}
                  instant
                  text={`${toUSD(Math.abs(lowSpousalSupport[0]))}`}
                  className='mb-4'
                />
                <small className='text-muted'>Low</small>
              </div>
              {!agreedSpousalSupport && (
                <div className='support-doughnut'>
                  <DonutChart
                    data={midSpousalSupport}
                    labels={rangeLabels}
                    instant
                    text={`${toUSD(Math.abs(midSpousalSupport[0]))}`}
                  />
                  <small className='text-muted'>Mid</small>
                </div>
              )}
              <div className='support-doughnut'>
                <DonutChart
                  data={highSpousalSupport}
                  labels={rangeLabels}
                  instant
                  text={`${toUSD(Math.abs(highSpousalSupport[0]))}`}
                />
                <small className='text-muted'>High</small>
              </div>
            </div>
          }
          description={
            <p>
              Spousal support is paid to assist the receiving spouse in dealing with unequal
              consequences of the breakdown of the relationship. This calculation is based on a
              Spousal Support Guideline Income of <b>{toRoundUSD(clientSSGuidelineIncome)}</b> for{' '}
              {clientName} and <b>{toRoundUSD(exSSGuidelineIncome)}</b> for {exName}.
            </p>
          }
        />
      )}

      {showChildSupportResults && (
        <React.Fragment>
          <SupportOverviewItem
            imageSrc='./img/icons/dusk/png/guardian.png'
            headerText='Child Support (s. 3)'
            headerCaption={
              <small className='d-block text-muted'>
                {formulaChildSupport === 'ex' && `${clientName} is primary parent`}
                {formulaChildSupport === 'client' && `${exName} is primary parent`}
                {formulaChildSupport === 'shared' && 'shared parenting'}
                {formulaChildSupport === 'split' && 'split parenting'}
              </small>
            }
            chart={
              <div
                className='row text-center doughnut-row'
                style={{ height: 150, width: 800, marginRight: -30 }}
              >
                <div className='support-doughnut'>
                  <DonutChart
                    data={allChildSupport}
                    labels={childSupportLabels}
                    instant
                    text={`${toUSD(allChildSupport[0])}`}
                  />
                  <small className='text-muted'>Guideline Support</small>
                </div>
              </div>
            }
            content={
              <React.Fragment>
                <h6 className='mb-0 d-inline'>
                  {toRoundUSD(
                    Math.abs(
                      customGet(
                        spousalSupport,
                        'scenarios[0].clientSpousalSupport.monthlyChildSupportNet',
                      ),
                    ),
                  )}
                </h6>
                <span className='ml-2 d-inline text-muted'>monthly</span>
              </React.Fragment>
            }
            description={
              <p>
                Section 3 Child support is a monthly amount calculated based on the payor's income.
                It is paid to assist with the costs of raising children. This calculation is based
                on a Child Support Guideline Income of <b>{toRoundUSD(clientCSGuidelineIncome)}</b>{' '}
                for {clientName} and <b>{toRoundUSD(exCSGuidelineIncome)}</b> for {exName}.
              </p>
            }
          />

          <SupportOverviewItem
            imageSrc='./img/icons/dusk/png/soccer-ball.png'
            headerText='Child Support (s. 7)'
            headerCaption={<small className='d-block text-muted'>special expenses</small>}
            chart={
              showSpousalSupport ? (
                <div
                  className='row text-center doughnut-row'
                  style={{ height: 150, width: 800, marginRight: -30 }}
                >
                  {!!agreedSpousalSupport && (
                    <div className='support-doughnut text-center'>
                      <DonutChart
                        data={agreedSpousalSpecialExpenses}
                        labels={rangeLabels}
                        instant
                        text={format(spousalSupport, `scenarios.4.${payor}.childExpenses.support`)}
                        className='mb-4'
                      />
                      <small className='text-muted'>Agreed</small>
                    </div>
                  )}
                  <div className='support-doughnut text-center'>
                    <DonutChart
                      data={lowSpecialExpenses}
                      labels={rangeLabels}
                      instant
                      text={format(spousalSupport, `scenarios.0.${payor}.childExpenses.support`)}
                      className='mb-4'
                    />
                    <small className='text-muted'>Low</small>
                  </div>
                  {!agreedSpousalSupport && (
                    <div className='support-doughnut'>
                      <DonutChart
                        data={midSpecialExpenses}
                        labels={rangeLabels}
                        instant
                        text={format(spousalSupport, `scenarios.1.${payor}.childExpenses.support`)}
                      />
                      <small className='text-muted'>Mid</small>
                    </div>
                  )}
                  <div className='support-doughnut'>
                    <DonutChart
                      data={highSpecialExpenses}
                      labels={rangeLabels}
                      instant
                      text={format(spousalSupport, `scenarios.2.${payor}.childExpenses.support`)}
                    />
                    <small className='text-muted'>High</small>
                  </div>
                </div>
              ) : (
                <div
                  className='row text-center doughnut-row'
                  style={{ height: 150, width: 800, marginRight: -30 }}
                >
                  <div className='support-doughnut'>
                    <DonutChart
                      data={noSpousalSpecialExpenses}
                      labels={['s. 7 Support']}
                      instant
                      text={format(
                        scenarios?.[3],
                        'clientSpousalSupport.childExpenses.monthlySupport',
                      )}
                    />
                    <small className='text-muted'>Expenses Support</small>
                  </div>
                </div>
              )
            }
            content={
              <React.Fragment>
                <h6 className='mb-0 d-inline'>
                  {showSpousalSupport ? (
                    <React.Fragment>
                      {format(
                        spousalSupport,
                        'scenarios.2.clientSpousalSupport.childExpenses.support',
                      )}
                      <span> to </span>
                      {format(
                        spousalSupport,
                        'scenarios.0.clientSpousalSupport.childExpenses.support',
                      )}
                    </React.Fragment>
                  ) : (
                    format(spousalSupport, 'scenarios.3.clientSpousalSupport.childExpenses.support')
                  )}
                </h6>
                <span className='ml-2 d-inline text-muted'>annual expense support</span>
              </React.Fragment>
            }
            description={
              <p>
                Section 7 Child support is paid to assist with certain "special" expenses such as
                child care, education, and other agreed-upon extraordinary expeneses.
              </p>
            }
          />

          <SupportOverviewItem
            imageSrc='./img/icons/dusk/png/money-box.png'
            headerText='Total Support'
            headerCaption={
              <small className='d-block text-muted'>
                child support
                {showSpousalSupport ? '  + spousal support' : ''}
              </small>
            }
            chart={
              showSpousalSupport ? (
                <div
                  className='row text-center doughnut-row'
                  style={{ height: 150, width: 800, marginRight: -30 }}
                >
                  {!!agreedSpousalSupport && (
                    <div className='support-doughnut text-center'>
                      <DonutChart
                        data={agreedTotalSupport}
                        labels={rangeLabels}
                        instant
                        text={round(
                          spousalSupport,
                          'scenarios[3].clientSpousalSupport.monthlyTotalSupport',
                        )}
                        className='mb-4'
                      />
                      <small className='text-muted'>Agreed</small>
                    </div>
                  )}
                  <div className='support-doughnut text-center'>
                    <DonutChart
                      data={lowTotalSupport}
                      labels={rangeLabels}
                      instant
                      text={round(
                        spousalSupport,
                        'scenarios[0].clientSpousalSupport.monthlyTotalSupport',
                      )}
                      className='mb-4'
                    />
                    <small className='text-muted'>Low</small>
                  </div>
                  {!agreedSpousalSupport && (
                    <div className='support-doughnut'>
                      <DonutChart
                        data={midTotalSupport}
                        labels={rangeLabels}
                        instant
                        text={round(
                          spousalSupport,
                          'scenarios[1].clientSpousalSupport.monthlyTotalSupport',
                        )}
                      />
                      <small className='text-muted'>Mid</small>
                    </div>
                  )}
                  <div className='support-doughnut'>
                    <DonutChart
                      data={highTotalSupport}
                      labels={rangeLabels}
                      instant
                      text={round(
                        spousalSupport,
                        'scenarios[2].clientSpousalSupport.monthlyTotalSupport',
                      )}
                    />
                    <small className='text-muted'>High</small>
                  </div>
                </div>
              ) : (
                <div
                  className='row text-center doughnut-row'
                  style={{ height: 150, width: 800, marginRight: -30 }}
                >
                  <div className='support-doughnut'>
                    <DonutChart
                      data={totalSupport}
                      labels={rangeLabels}
                      instant
                      text={round(
                        spousalSupport,
                        'scenarios[3].clientSpousalSupport.monthlyTotalSupport',
                      )}
                    />
                    <small className='text-muted'>Total Support</small>
                  </div>
                </div>
              )
            }
            content={
              <React.Fragment>
                <h6 className='mb-0 d-inline'>
                  {showSpousalSupport ? (
                    <React.Fragment>
                      {round(
                        spousalSupport,
                        'scenarios[0].clientSpousalSupport.monthlyTotalSupport',
                      )}
                      <span> to </span>
                      {round(
                        spousalSupport,
                        'scenarios[2].clientSpousalSupport.monthlyTotalSupport',
                      )}
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      {round(
                        spousalSupport,
                        'scenarios[3].clientSpousalSupport.monthlyTotalSupport',
                      )}
                    </React.Fragment>
                  )}
                </h6>
                <span className='ml-2 d-inline text-muted'>monthly</span>
              </React.Fragment>
            }
            secondaryContent={
              showSpousalSupport ? (
                <React.Fragment>
                  <h6 className='mb-0 d-inline'>
                    {`${minMonthlyNetSupport} to ${maxMonthlyNetSupport}`}
                  </h6>
                  <span className='ml-2 d-inline text-muted'>
                    after-tax cost to payor (more details in section 5)
                  </span>
                </React.Fragment>
              ) : undefined
            }
            description={
              <p>
                {`Total support includes the combined child support ${
                  showSpousalSupport ? 'and spousal support' : ''
                } payments listed above`}
              </p>
            }
          />
        </React.Fragment>
      )}

      <SupportOverviewItem
        imageSrc='./img/icons/dusk/png/pie-chart.png'
        headerText='Monthly Budget'
        headerCaption={<small className='d-block text-muted'>cash flow comparison</small>}
        chart={
          <MonthlyBudgetCharts
            clientData={clientData}
            exData={exData}
            showSpousalSupport={showSpousalSupport}
          />
        }
        content={
          <React.Fragment>
            <h6 className='mb-0 d-inline'>
              {showSpousalSupport ? (
                <React.Fragment>
                  {round(spousalSupport, 'scenarios.0.clientSpousalSupport.monthlyCash', 0)}
                  <span> to </span>
                  {round(spousalSupport, 'scenarios.2.clientSpousalSupport.monthlyCash', 0)}
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {toRoundUSD(
                    Math.abs(
                      customGet(spousalSupport, 'scenarios.3.clientSpousalSupport.monthlyCash', 0),
                    ),
                  )}
                  <span> vs </span>
                  {toRoundUSD(
                    Math.abs(
                      customGet(spousalSupport, 'scenarios.3.exSpousalSupport.monthlyCash', 0),
                    ),
                  )}
                </React.Fragment>
              )}
            </h6>
            <span className='ml-2 d-inline text-muted'>monthly</span>
          </React.Fragment>
        }
        description={
          <p>
            The monthly cash flow available to budget with after taxes, support payments and
            government benefits.
          </p>
        }
        noBorder
      />
      {!showChildSupportResults && (
        <React.Fragment>
          <h6 className='mt-4'>&nbsp;</h6>
          <div className='row text-center spacer-row' />
          <h6 className='mt-4'>&nbsp;</h6>
          <div className='row text-center spacer-row' />
          <h6 className='mt-4'>&nbsp;</h6>
          <div className='row text-center spacer-row' />
          <h6 className='mt-4'>&nbsp;</h6>
          <div className='row text-center spacer-row' />
        </React.Fragment>
      )}
    </div>
  );
};

export default SupportOverview;
