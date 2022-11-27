/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { Fragment, useMemo } from 'react';

import PaperplanePage from 'components/calculations/SupportReport/detailed/sections/PaperplanePage';
import Overview from 'components/calculations/SupportReport/detailed/sections/Overview';
import Spousal from 'components/calculations/SupportReport/detailed/sections/Spousal';
import ChildSupportS3 from 'components/calculations/SupportReport/detailed/sections/ChildSupportS3';
import ChildSupportS7 from 'components/calculations/SupportReport/detailed/sections/ChildSupportS7';
import Conclusion from 'components/calculations/SupportReport/detailed/sections/Conclusion';
import Total from 'components/calculations/SupportReport/detailed/sections/Total';
import MonthlyBudget from 'components/calculations/SupportReport/detailed/sections/MonthlyBudget';
import DetailedInputs from 'components/calculations/SupportReport/detailed/sections/DetailedInputs';
import TaxProfiles from 'components/calculations/SupportReport/detailed/sections/TaxProfiles';
import Warnings from 'components/calculations/SupportReport/detailed/sections/Warnings';
import Help from 'components/calculations/SupportReport/detailed/sections/Help';
import CardHeader from 'components/calculations/components/CardHeader';
import GeneratePDFButtonContainer from 'components/calculations/SupportReport/components/GeneratePDF/GeneratePDFButtonContainer';
import DetailedSupportReportStyles from 'components/calculations/SupportReport/detailedStyles';

import useCalculationContext from 'hooks/useCalculationContext';

import customGet from 'utils/get';
import calc from 'utils/calc';

const DetailedSupportReportPage = ({
  supportCalculation,
  supportCalculationResult,
  isPaperplaneRequest,
  professional,
}) => {
  const { isSubscriptionActive } = useCalculationContext();

  const { childSupport, spousalSupport } = supportCalculationResult || {};
  const { children, showChildSupport, showSpousalSupport, clientSupportProfile, exSupportProfile } =
    supportCalculation || {};

  const agreedChildSupport =
    supportCalculation?.agreedChildSupport < 0 ? null : supportCalculation?.agreedChildSupport;
  const agreedSpousalSupport =
    supportCalculation?.agreedSpousalSupport < 0 ? null : supportCalculation?.agreedSpousalSupport;

  const showChildSupportResults = showChildSupport && children?.length > 0;

  const payor = `${customGet(spousalSupport, 'payor', '')}SpousalSupport`;
  const payee = `${customGet(spousalSupport, 'payee', '')}SpousalSupport`;

  const scenarios = customGet(spousalSupport, 'scenarios', []);
  const payorName = customGet(
    supportCalculation,
    `${spousalSupport?.payor}SupportProfile.firstName`,
    '',
  );
  const payeeName = customGet(
    supportCalculation,
    `${spousalSupport?.payee}SupportProfile.firstName`,
    '',
  );

  const clientName = `${clientSupportProfile?.firstName} ${clientSupportProfile?.lastName}`;
  const exName = `${exSupportProfile?.firstName} ${exSupportProfile?.lastName}`;

  const [
    lowSpousalSupport = [],
    midSpousalSupport = [],
    highSpousalSupport = [],
    agreedSpousalSupportScenario = [],
  ] = scenarios
    ?.slice(0, 4)
    ?.map(scenario => calc(scenario, payor, 'monthlySpousalSupport', 'monthlyCash'));

  const [lowTotalSupport, midTotalSupport, highTotalSupport] = useMemo(() => {
    const supports = Array(3)
      .fill(0)
      .map(() =>
        calc(
          scenarios?.[2],
          payor,
          'monthlySpousalSupport',
          'monthlyChildSupportNet',
          'childExpenses.monthlySupport',
        ),
      );

    if (supports[0]?.[0] === 0 && supports[0]?.[1] === 0)
      return [lowSpousalSupport, midSpousalSupport, highSpousalSupport];

    return supports;
  }, [highSpousalSupport, midSpousalSupport, lowSpousalSupport, payor, scenarios]);

  const allChildSupport = calc(scenarios?.[3], payor, 'monthlyChildSupportNet', 'monthlyCash');

  const agreedChildSupportDonut = [
    agreedChildSupport,
    customGet(childSupport, `${payee}.netMonthlySupport`),
  ];

  // const clientExpenses = customGet(scenarios?.[3], 'client.childExpenses.share', 'share');
  // const exExpenses = customGet(scenarios?.[3], 'ex.childExpenses.share', 'share');
  // const noSpousalExpensesComparison = [Math.round(clientExpenses), Math.round(exExpenses)];

  // const clientExpensesAgreedSpousal = customGet(
  //   scenarios?.[4],
  //   'client.childExpenses.share',
  //   'share'
  // );
  // const exExpensesAgreedSpousal = customGet(scenarios?.[4], 'ex.childExpenses.share', 'share');
  // const agreedSpousalExpensesComparison = [
  //   Math.round(clientExpensesAgreedSpousal),
  //   Math.round(exExpensesAgreedSpousal)
  // ];
  const agreedSpousalSpecialExpenses = calc(scenarios?.[4], payor, 'childExpenses.share', 'share');

  // no spousal total support
  // const totalSupportData = calc(
  //   scenarios?.[3],
  //   payor,
  //   'monthlySpousalSupport',
  //   'monthlyChildSupportNet',
  //   'childExpenses.monthlySupport'
  // );
  // const clientIncome = customGet(scenarios?.[3], 'client.monthlyIncomeNetSupport', '');
  // const exIncome = customGet(scenarios?.[3], 'ex.monthlyIncomeNetSupport', '');
  // const incomeComparison = [Math.round(clientIncome), Math.round(exIncome)];

  // const minDuration = customGet(supportCalculation, 'spousalSupport?.minDuration', 0);
  // const maxDuration = customGet(supportCalculation, 'spousalSupport?.maxDuration', 0);
  // let indefiniteDuration = false;
  // if (minDuration > 99) {
  //   indefiniteDuration = true;
  // }
  const taxYear = customGet(supportCalculation, 'taxYear', '2021');

  const {
    spousalSupportIndex,
    childSupportIndex,
    specialExpensesIndex,
    totalSupportIndex,
    monthlyBudgetIndex,
    detailedInputsIndex,
    helpIndex,
    reportTitle,
    reportType,
  } = useMemo(() => {
    const indexes = {
      spousalSupportIndex: '2',
      childSupportIndex: '3',
      specialExpensesIndex: '4',
      totalSupportIndex: '5',
      monthlyBudgetIndex: '6',
      detailedInputsIndex: '7',
      helpIndex: '8',
      reportTitle: `Child Support & Spousal Support - ${taxYear}`,
      reportType: 'child support & spousal support',
    };

    if (showSpousalSupport && !showChildSupportResults)
      return {
        ...indexes,
        monthlyBudgetIndex: '3',
        detailedInputsIndex: '4',
        helpIndex: '5',
        reportTitle: `Spousal Support Report - ${taxYear}`,
        reportType: 'spousal support',
      };

    if (!showSpousalSupport)
      return {
        ...indexes,
        specialExpensesIndex: '3',
        totalSupportIndex: '4',
        monthlyBudgetIndex: '5',
        detailedInputsIndex: '6',
        helpIndex: '7',
        reportTitle: `Child Support Report - ${taxYear}`,
        reportType: 'child support',
      };

    return indexes;
  }, [showChildSupportResults, showSpousalSupport, taxYear]);

  // check for exceptions/cautions to the formulas to display warnings

  const retroactiveSupport = taxYear !== '2021';
  const csPayorIncomeAboveCeiling = customGet(childSupport, `${payor}.guidelineIncome`, 0) > 150000;
  const ssPayorIncomeAboveCeiling =
    customGet(scenarios?.[3], `${payor}.monthlyGuidelineIncome`, 0) * 12.0 > 350000;
  const ssPayorIncomeBelowFloor =
    customGet(scenarios?.[3], `${payor}.monthlyGuidelineIncome`, 0) * 12.0 < 20000;
  const ssPayorIncomeLowRange = !!(
    !ssPayorIncomeBelowFloor &&
    customGet(scenarios?.[3], `${payor}.monthlyGuidelineIncome`, 0) * 12.0 < 30000
  );
  const ssChildDisability =
    Array.isArray(children) && children.find(({ disability }) => disability === true);
  const ssPayorDisability = payor.disability === true;
  const ssPayorNonTaxableIncome = useMemo(
    () =>
      showSpousalSupport &&
      customGet(scenarios?.[3], `${payor}.income.federalTaxableIncome`, 0) -
        customGet(scenarios?.[3], `${payor}.federalDeductions.total`, 0) <
        customGet(scenarios?.[3], `${payor}.spousalSupport`, 0) * 12.0,
    [showSpousalSupport, scenarios, payor],
  );
  const ssCustodialPayor = useMemo(
    () => (showSpousalSupport ? customGet(spousalSupport, 'formula') === 'Custodial Payor' : false),
    [showSpousalSupport, spousalSupport],
  );

  return (
    <DetailedSupportReportStyles>
      {isPaperplaneRequest && (
        <PaperplanePage
          clientName={clientName}
          exName={exName}
          reportTitle={reportTitle}
          reportType={reportType}
          professional={professional}
          showChildSupportResults={showChildSupportResults}
          showSpousalSupport={showSpousalSupport}
        />
      )}

      <Overview
        supportCalculation={supportCalculation}
        childSupport={childSupport}
        spousalSupport={spousalSupport}
        clientName={clientName}
        exName={exName}
        showChildSupportResults={showChildSupportResults}
        showSpousalSupport={showSpousalSupport}
        showChildSupport={showChildSupport}
      />

      {showSpousalSupport && (
        <Spousal
          supportCalculation={supportCalculation}
          spousalSupport={spousalSupport}
          childSupport={childSupport}
          lowSpousalSupport={lowSpousalSupport}
          midSpousalSupport={midSpousalSupport}
          highSpousalSupport={highSpousalSupport}
          agreedSpousalSupport={agreedSpousalSupport}
          agreedSpousalSupportScenario={agreedSpousalSupportScenario}
          showSpousalSupport={showSpousalSupport}
          index={spousalSupportIndex}
        />
      )}

      {showChildSupportResults && (
        <Fragment>
          <ChildSupportS3
            childSupport={childSupport}
            supportCalculation={supportCalculation}
            agreedChildSupport={agreedChildSupport}
            agreedChildSupportDonut={agreedChildSupportDonut}
            allChildSupport={allChildSupport}
            clientName={clientName}
            exName={exName}
            index={childSupportIndex}
          />

          <ChildSupportS7
            index={specialExpensesIndex}
            showSpousalSupport={showSpousalSupport}
            agreedSpousalSupport={agreedSpousalSupport}
            agreedSpousalSpecialExpenses={agreedSpousalSpecialExpenses}
            spousalSupport={spousalSupport}
            payor={payor}
            payee={payee}
            scenarios={scenarios}
            exSupportProfile={exSupportProfile}
            clientSupportProfile={clientSupportProfile}
          />

          <Conclusion
            showSpousalSupport={showSpousalSupport}
            scenarios={scenarios}
            payorName={payorName}
            payor={payor}
            payee={payee}
            payeeName={payeeName}
          />
        </Fragment>
      )}

      {showChildSupportResults && (
        <Total
          showSpousalSupport={showSpousalSupport}
          showChildSupportResults={showChildSupportResults}
          payeeName={payeeName}
          agreedSpousalSupport={agreedSpousalSupport}
          agreedSpousalSpecialExpenses={agreedSpousalSpecialExpenses}
          scenarios={scenarios}
          lowTotalSupport={lowTotalSupport}
          midTotalSupport={midTotalSupport}
          highTotalSupport={highTotalSupport}
          spousalSupport={spousalSupport}
          exSupportProfile={exSupportProfile}
          clientSupportProfile={clientSupportProfile}
          index={totalSupportIndex}
        />
      )}

      <MonthlyBudget
        index={monthlyBudgetIndex}
        spousalSupport={spousalSupport}
        clientSupportProfile={clientSupportProfile}
        exSupportProfile={exSupportProfile}
        showSpousalSupport={showSpousalSupport}
        agreedSpousalSupport={agreedSpousalSupport}
      />

      <DetailedInputs
        index={detailedInputsIndex}
        clientName={clientName}
        exName={exName}
        supportCalculation={supportCalculation}
        childSupport={childSupport}
        showChildSupport={showChildSupport}
        showSpousalSupport={showSpousalSupport}
        scenarios={scenarios}
        childrenArr={children}
      />

      <TaxProfiles
        supportCalculation={supportCalculation}
        showSpousalSupport={showSpousalSupport}
        clientSupportProfile={clientSupportProfile}
        spousalSupport={spousalSupport}
        agreedSpousalSupport={agreedSpousalSupport}
        exSupportProfile={exSupportProfile}
      />

      {(retroactiveSupport ||
        csPayorIncomeAboveCeiling ||
        ssPayorIncomeAboveCeiling ||
        ssPayorIncomeBelowFloor ||
        ssPayorIncomeLowRange) && (
        <div className='support-report-page'>
          <div className='calculator-section'>
            <Warnings
              ssPayorIncomeLowRange={ssPayorIncomeLowRange}
              ssPayorIncomeBelowFloor={ssPayorIncomeBelowFloor}
              ssPayorIncomeAboveCeiling={ssPayorIncomeAboveCeiling}
              csPayorIncomeAboveCeiling={csPayorIncomeAboveCeiling}
              ssChildDisability={ssChildDisability}
              ssPayorDisability={ssPayorDisability}
              ssPayorNonTaxableIncome={ssPayorNonTaxableIncome}
              ssCustodialPayor={ssCustodialPayor}
              showChildSupport={showChildSupportResults}
              showSpousalSupport={showSpousalSupport}
              retroactiveSupport={retroactiveSupport}
              taxYear={taxYear}
            />
          </div>
        </div>
      )}

      <Help
        index={helpIndex}
        showChildSupportResults={showChildSupportResults}
        showSpousalSupport={showSpousalSupport}
      />

      {!isPaperplaneRequest && (
        <div className='support-report-page'>
          <CardHeader
            text='Generate Reports'
            src='./img/icons/dusk/png/brief.png'
            avatarContent='PDF reports for mediation & court'
            report
          />

          <div className='calculator-section'>
            <p>
              Generate a detailed PDF report setting out spousal support
              {showChildSupportResults > 0 && ', child support'} and detailed financials for both
              parties. Suitable for court, mediation, or negotiation.
            </p>
            <p>Select the type of report you wish to download below.</p>
            <div className='ml-1'>
              {!isSubscriptionActive && (
                <React.Fragment>
                  <p>Subscribe to unlock</p>
                  <button disabled className='btn btn-primary' type='button'>
                    Generate PDF
                  </button>
                </React.Fragment>
              )}
              {isSubscriptionActive && <GeneratePDFButtonContainer />}
            </div>
          </div>
        </div>
      )}
    </DetailedSupportReportStyles>
  );
};

export default DetailedSupportReportPage;
