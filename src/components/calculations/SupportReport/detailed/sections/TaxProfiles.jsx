import React from 'react';

import TaxProfileTable from 'components/calculations/SupportReport/components/TaxProfileTable';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const TaxProfiles = ({
  showSpousalSupport,
  clientSupportProfile,
  spousalSupport,
  agreedSpousalSupport,
  exSupportProfile,
  supportCalculation,
}) => (
  <div className='support-report-page'>
    <div className='calculator-section'>
      <h6 className='mt-4'>Tax Profiles</h6>

      <p>
        {showSpousalSupport &&
          'The taxes paid and benefits received by each party will vary depending on the amount of spousal support that is paid.'}
        Detailed tax profiles for each party are set out below. The <FontAwesomeIcon icon='edit' />{' '}
        symbol denotes amounts that have been manually added by the user. The{' '}
        <FontAwesomeIcon icon='exclamation-triangle' /> symbol denotes amounts where the default
        value has been overridden by the user.
      </p>

      <div className='row pl-3 pr-3'>
        <div className='col-6'>
          <TaxProfileTable
            party='client'
            supportCalculation={supportCalculation}
            supportProfile={clientSupportProfile}
            scenarios={spousalSupport?.scenarios}
            agreedSpousalSupport={agreedSpousalSupport}
            showSpousalSupport={showSpousalSupport}
          />
        </div>

        <div className='col-6'>
          <TaxProfileTable
            party='ex'
            supportCalculation={supportCalculation}
            supportProfile={exSupportProfile}
            scenarios={spousalSupport?.scenarios}
            agreedSpousalSupport={agreedSpousalSupport}
            showSpousalSupport={showSpousalSupport}
          />
        </div>
      </div>
    </div>
  </div>
);

export default TaxProfiles;
