import React, { useState, Fragment, useMemo } from 'react';

import { useFormikContext } from 'formik';

import customGet from 'utils/get';
import mergeByKey from 'utils/mergeByKey';
import allTaxTables from 'utils/taxTables';

import AmountTable from './AmountTable';
import AmountTablesNavBar from './AmountTablesNavBar';

const AmountTables = ({ partyType, supportCalculation }) => {
  const { values } = useFormikContext();
  const [activeTab, toggleActiveTab] = useState('credits');

  const taxTables = useMemo(() => allTaxTables[values.taxYear], [values.taxYear]);

  const residence = useMemo(
    () => customGet(values, `${partyType}.residence`, []),
    [partyType, values],
  );

  const federalBenefitsOptions = useMemo(
    () => taxTables.federal.benefits,
    [taxTables.federal.benefits],
  );
  const provincialBenefitsOptions = useMemo(
    () => customGet(taxTables, `provincial.${residence}.benefits`, []),
    [residence, taxTables],
  );
  const federalDeductionsOptions = useMemo(
    () => taxTables.federal.deductions,
    [taxTables.federal.deductions],
  );
  const provincialDeductionsOptions = useMemo(
    () => customGet(taxTables, `provincial.${residence}.deductions`, []),
    [residence, taxTables],
  );
  const federalCreditsOptions = useMemo(
    () => taxTables.federal.credits,
    [taxTables.federal.credits],
  );
  const provincialCreditsOptions = useMemo(
    () => customGet(taxTables, `provincial.${residence}.credits`, []),
    [residence, taxTables],
  );

  const savedFederalBenefits = useMemo(
    () => customGet(values, `${partyType}.federalBenefits.all`, []),
    [partyType, values],
  );
  const federalBenefits = useMemo(
    () => mergeByKey(savedFederalBenefits, federalBenefitsOptions),
    [federalBenefitsOptions, savedFederalBenefits],
  );

  const savedFederalCredits = useMemo(
    () => customGet(values, `${partyType}.federalCredits.all`, []),
    [partyType, values],
  );

  const federalCredits = useMemo(
    () => mergeByKey(savedFederalCredits, federalCreditsOptions),
    [federalCreditsOptions, savedFederalCredits],
  );

  const savedFederalDeductions = useMemo(
    () => customGet(values, `${partyType}.federalDeductions.all`, []),
    [partyType, values],
  );

  const federalDeductions = useMemo(
    () => mergeByKey(savedFederalDeductions, federalDeductionsOptions),
    [federalDeductionsOptions, savedFederalDeductions],
  );

  const savedProvincialBenefits = useMemo(
    () => customGet(values, `${partyType}.provincialBenefits.all`, []),
    [partyType, values],
  );
  const provincialBenefits = useMemo(
    () => mergeByKey(savedProvincialBenefits, provincialBenefitsOptions),
    [provincialBenefitsOptions, savedProvincialBenefits],
  );

  const savedProvincialCredits = useMemo(
    () => customGet(values, `${partyType}.provincialCredits.all`, []),
    [partyType, values],
  );
  const provincialCredits = useMemo(
    () => mergeByKey(savedProvincialCredits, provincialCreditsOptions),
    [provincialCreditsOptions, savedProvincialCredits],
  );

  const savedProvincialDeductions = useMemo(
    () => customGet(values, `${partyType}.provincialDeductions.all`, []),
    [partyType, values],
  );
  const provincialDeductions = useMemo(
    () => mergeByKey(savedProvincialDeductions, provincialDeductionsOptions),
    [provincialDeductionsOptions, savedProvincialDeductions],
  );

  const benefitsCount = useMemo(
    () => federalBenefits.length + provincialBenefits.length,
    [federalBenefits.length, provincialBenefits.length],
  );
  const deductionsCount = useMemo(
    () => federalDeductions.length + provincialDeductions.length,
    [federalDeductions.length, provincialDeductions.length],
  );
  const creditsCount = useMemo(
    () => federalCredits.length + provincialCredits.length,
    [federalCredits.length, provincialCredits.length],
  );

  return (
    <Fragment>
      <AmountTablesNavBar
        partyType={partyType}
        activeTab={activeTab}
        toggleActiveTab={toggleActiveTab}
        benefitsCount={benefitsCount}
        deductionsCount={deductionsCount}
        creditsCount={creditsCount}
      />

      <div className='tab-content mb-4'>
        <AmountTable
          active={activeTab === 'credits'}
          partyType={partyType}
          residence={residence}
          federalAmounts={federalCredits}
          provincialAmounts={provincialCredits}
          federalOptions={federalCreditsOptions}
          provincialOptions={provincialCreditsOptions}
          fieldType='credits'
          amountLabel='Tax Credits'
          supportCalculation={supportCalculation}
        />
        <AmountTable
          active={activeTab === 'deductions'}
          partyType={partyType}
          residence={residence}
          federalAmounts={federalDeductions}
          provincialAmounts={provincialDeductions}
          federalOptions={federalDeductionsOptions}
          provincialOptions={provincialDeductionsOptions}
          fieldType='deductions'
          amountLabel='Tax Deductions'
          supportCalculation={supportCalculation}
        />
        <AmountTable
          active={activeTab === 'benefits'}
          partyType={partyType}
          residence={residence}
          federalAmounts={federalBenefits}
          provincialAmounts={provincialBenefits}
          federalOptions={federalBenefitsOptions}
          provincialOptions={provincialBenefitsOptions}
          fieldType='benefits'
          amountLabel='Benefits'
          supportCalculation={supportCalculation}
        />
      </div>
    </Fragment>
  );
};

export default AmountTables;
