import React, { useMemo } from 'react';

import { useFormikContext } from 'formik';

import Icon from 'components/common/Icon';

import CardHeader from 'components/calculations/components/CardHeader';
import AmountTables from 'components/calculations/components/AmountTables/AmountTables';

import useCalculationContext from 'hooks/useCalculationContext';

const TaxBenefitsSection = ({ supportCalculation, showSpousalSupport }) => {
  const { values } = useFormikContext();
  const { isProfessional } = useCalculationContext();

  const clientFirstName = useMemo(
    () =>
      values?.clientSupportProfile?.firstName
        ? values.clientSupportProfile.firstName === 'You'
          ? 'Your'
          : `${values.clientSupportProfile.firstName}'s`
        : "Client's",
    [values],
  );

  const exFirstName = useMemo(
    () => (values?.exSupportProfile?.firstName ? `${values.exSupportProfile.firstName}'s` : "Ex's"),
    [values],
  );

  return (
    <div name='#tax' id='tax' className='calculator-section-container taxes'>
      <CardHeader text='5. Tax & Benefits' src='./img/icons/dusk/png/accounting.png' />

      <div className='calculator-section'>
        <p>
          The calculator automatically calculates the credits and benefits
          {isProfessional ? ' the parties ' : ' you and your spouse '}
          are likely to receive. However, you may need to enter additional credits, deductions or
          benefits, or override automatically calculated benefits.
        </p>
        <p>
          Add or override any tax amounts that are not automatically calculated using the form
          below.
        </p>
        <h5>{clientFirstName} Tax Credits & Benefits</h5>
        {/* {isActionAllowed === false && <Popover target="subscribe" text="Subscribe to unlock" />} */}

        <AmountTables partyType='clientSupportProfile' supportCalculation={supportCalculation} />

        <h5>{exFirstName} Tax Credits & Benefits</h5>

        <AmountTables partyType='exSupportProfile' supportCalculation={supportCalculation} />

        <p>
          <Icon name='edit' className='ml-2' /> denotes amounts that have been manually added by the
          user
          <br />
          <Icon name='triangle' className='ml-2' /> denotes amounts where the default value has been
          overridden by the user
        </p>
        <p>
          <em>
            {showSpousalSupport && (
              <span>
                *Amounts are calculated based on taxable income without spousal support, and may
                vary based on spousal support as shown in the "results" section below.
              </span>
            )}
            <span>
              Tax credits and benefits are relevant to the determination of s. 7 child support (i.e.
              apportionment of special child-related expenses), as well as spousal support.
            </span>
          </em>
        </p>
      </div>
    </div>
  );
};

export default TaxBenefitsSection;
