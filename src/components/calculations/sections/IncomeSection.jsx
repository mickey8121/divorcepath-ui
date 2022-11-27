import React, { useContext, useMemo } from 'react';

import { connect } from 'formik';

import CardHeader from 'components/calculations/components/CardHeader';
import IncomesList from 'components/calculations/components/Incomes/IncomesList';

import CalculationContext from 'context/CalculationContext/CalculationContext';

const IncomeSection = ({ formik, showChildSupportResults }) => {
  const { isProfessional } = useContext(CalculationContext);

  const clientFirstName = useMemo(
    () =>
      formik?.values?.clientSupportProfile?.firstName
        ? formik.values.clientSupportProfile.firstName === 'You'
          ? 'Your'
          : `${formik.values.clientSupportProfile.firstName}'s`
        : "Client's",
    [formik],
  );

  const exFirstName = useMemo(
    () =>
      formik?.values?.exSupportProfile?.firstName
        ? `${formik.values.exSupportProfile.firstName}'s`
        : "Ex's",
    [formik],
  );

  return (
    <div className='calculator-section-container income' name='#income' id='income'>
      <CardHeader src='./img/icons/dusk/png/receive-cash.png' text='4. Income' />
      <div className='calculator-section'>
        <p>
          Enter all recurring sources of income for both
          {isProfessional ? ' your client and the opposing party. ' : ' you and your ex. '}
          Include both taxable and non-taxable income. For example, include: employment, pension,
          self-employment, and dividend income. For many people, this information can be copied from
          the "Total Income" page of their last T1 tax return.
        </p>

        <h5>
          <span>{clientFirstName} Income</span>
        </h5>

        <IncomesList
          partyType='clientSupportProfile'
          partyFirstName={clientFirstName}
          showChildSupportResults={showChildSupportResults}
        />

        <h5 className='pt-4'>
          <span>{exFirstName} Income</span>
        </h5>

        <IncomesList
          partyType='exSupportProfile'
          partyFirstName={exFirstName}
          showChildSupportResults={showChildSupportResults}
        />

        <p className='mt-3'>
          Once all sources of income are entered for both parties, review estimated tax credits and
          benefits below.
        </p>
      </div>
    </div>
  );
};

export default connect(IncomeSection);
