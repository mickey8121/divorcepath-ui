import React from 'react';

import CardHeader from 'components/calculations/components/CardHeader';
import MonthlyBudgetTable from 'components/calculations/SupportReport/components/MonthlyBudgetTable';

const MonthlyBudget = ({
  index,
  spousalSupport,
  clientSupportProfile,
  exSupportProfile,
  showSpousalSupport,
  agreedSpousalSupport,
}) => (
  <div className='support-report-page'>
    <CardHeader
      text={`${index}. Monthly Budget`}
      src='./img/icons/dusk/png/pie-chart.png'
      avatarContent='net income comparison'
      report
    />

    <div className='calculator-section'>
      <h6>Monthly Budget Income</h6>

      <p>
        The table below compares the net after-tax cash available to each spouse, after accounting
        for support, taxes, and government benefits.
      </p>

      <MonthlyBudgetTable
        spousalSupport={spousalSupport}
        clientName={clientSupportProfile?.firstName}
        exName={exSupportProfile?.firstName}
        showSpousalSupport={showSpousalSupport}
        agreedSpousalSupport={agreedSpousalSupport}
      />
      <h6 className='mt-4'>&nbsp;</h6>
      <p>
        The net after-tax cash budget figure above is intended to be a reference point to assist the
        parties in understanding the cash that would be available to budget with on a monthly and
        annual basis, accounting for support and any tax or benefit consequences of support.
      </p>
      <div className='row text-center spacer-row' />
    </div>
  </div>
);

export default MonthlyBudget;
