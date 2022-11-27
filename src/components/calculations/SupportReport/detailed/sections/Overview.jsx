import React from 'react';

import CardHeader from 'components/calculations/components/CardHeader';
import SupportOverview from 'components/calculations/SupportReport/components/SupportOverview';

const Overview = ({
  supportCalculation,
  childSupport,
  spousalSupport,
  clientName,
  exName,
  showChildSupportResults,
  showChildSupport,
  showSpousalSupport,
}) => (
  <div className='support-report-page'>
    <CardHeader
      text='1. Overview'
      src='./img/icons/dusk/png/teacher-hiring.png'
      avatarContent='Summary of Support'
      report
    />
    <div className='calculator-section'>
      <SupportOverview
        supportCalculation={supportCalculation}
        childSupport={childSupport}
        spousalSupport={spousalSupport}
        clientName={clientName}
        exName={exName}
        showChildSupportResults={showChildSupportResults}
        showSpousalSupport={showSpousalSupport}
        showChildSupport={showChildSupport}
      />
    </div>
  </div>
);

export default Overview;
