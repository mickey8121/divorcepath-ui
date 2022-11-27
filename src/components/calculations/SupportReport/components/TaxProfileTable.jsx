/* eslint-disable react/no-array-index-key */

import React, { useMemo } from 'react';

import numeral from 'numeral';
import dayjs from 'dayjs';

import customGet from 'utils/get';
import allTaxTables from 'utils/taxTables';

import TaxProfileRow from './TaxProfileRow';

const TaxProfileTable = ({
  supportCalculation,
  supportProfile,
  party,
  scenarios,
  agreedSpousalSupport,
  showSpousalSupport,
}) => {
  const taxTables = useMemo(() => allTaxTables[supportCalculation?.taxYear], [supportCalculation]);

  // get TaxTables information
  const residence = customGet(supportProfile, 'residence');
  const incomeOptions = customGet(taxTables, 'income', []);
  const federalBenefitsOptions = customGet(taxTables, 'federal.benefits', []);
  const federalDeductionsOptions = customGet(taxTables, 'federal.deductions', []);
  const federalCreditsOptions = customGet(taxTables, 'federal.credits', []);
  const federalTaxAdjustmentsOptions = customGet(taxTables, 'federal.taxAdjustments', []);

  const provincialBenefitsOptions = customGet(taxTables, `provincial.${residence}.benefits`, []);
  const provincialDeductionsOptions = customGet(
    taxTables,
    `provincial.${residence}.deductions`,
    [],
  );
  const provincialCreditsOptions = customGet(taxTables, `provincial.${residence}.credits`, []);
  const provincialTaxAdjustmentsOptions = customGet(
    taxTables,
    `provincial.${residence}.taxAdjustments`,
    [],
  );

  function merge(arr1, arr2) {
    const temp = [];
    arr1.forEach(amount => {
      const amountDetails = arr2.find(option => option.key === amount.key);
      temp.push({ ...amount, ...amountDetails });
    });
    return temp;
  }

  // get array of incomes, adjustments, hardship
  const incomes = merge(supportProfile?.income?.all || [], incomeOptions);

  // get array of tax deductions
  const federalTaxDeductions = merge(
    customGet(scenarios?.[3], `${party}SpousalSupport.federalDeductions.all`, []),
    federalDeductionsOptions,
  );

  const provincialTaxDeductions = merge(
    customGet(scenarios?.[3], `${party}SpousalSupport.provincialDeductions.all`, []),
    provincialDeductionsOptions,
  );
  // get array of tax credits
  const federalTaxCredits = merge(
    customGet(scenarios?.[3], `${party}SpousalSupport.federalCredits.all`, []),
    federalCreditsOptions,
  );
  const provincialTaxCredits = merge(
    customGet(scenarios?.[3], `${party}SpousalSupport.provincialCredits.all`, []),
    provincialCreditsOptions,
  );
  // get array of benefits
  const federalBenefits = merge(
    customGet(scenarios?.[3], `${party}SpousalSupport.federalBenefits.all`, []),
    federalBenefitsOptions,
  );

  const provincialBenefits = merge(
    customGet(scenarios?.[3], `${party}SpousalSupport.provincialBenefits.all`, []),
    provincialBenefitsOptions,
  );
  // get array of tax adjustments
  const federalTaxAdjustments = merge(
    customGet(scenarios?.[3], `${party}SpousalSupport.federalTaxAdjustments.all`, []),
    federalTaxAdjustmentsOptions,
  );
  const provincialTaxAdjustments = merge(
    customGet(scenarios?.[3], `${party}SpousalSupport.provincialTaxAdjustments.all`, []),
    provincialTaxAdjustmentsOptions,
  );

  const clientAge = dayjs().diff(customGet(supportProfile, 'birthDate', ''), 'years');

  const firstScenario = showSpousalSupport
    ? agreedSpousalSupport
      ? scenarios?.[4]
      : scenarios?.[0]
    : scenarios?.[3];
  const secondScenario = agreedSpousalSupport ? scenarios?.[0] : scenarios?.[1];
  const thirdScenario = scenarios?.[2];

  const spousalFirstScenario =
    customGet(firstScenario, `${party}SpousalSupport.monthlySpousalSupport`, 0) * 12;
  const spousalSecondScenario =
    customGet(secondScenario, `${party}SpousalSupport.monthlySpousalSupport`, 0) * 12;
  const spousalThirdScenario =
    customGet(thirdScenario, `${party}SpousalSupport.monthlySpousalSupport`, 0) * 12;
  const line1500FirstScenario = numeral(
    customGet(firstScenario, `${party}SpousalSupport.income.total`, 0) + spousalFirstScenario,
  );
  const line1500SecondScenario = numeral(
    customGet(secondScenario, `${party}SpousalSupport.income.total`, 0) + spousalSecondScenario,
  );
  const line1500ThirdScenario = numeral(
    customGet(thirdScenario, `${party}SpousalSupport.income.total`, 0) + spousalThirdScenario,
  );
  const familyIncomeFirstScenario = numeral(
    customGet(firstScenario, `${party}SpousalSupport.income.adjustedFamilyIncome`, 0) +
      spousalFirstScenario,
  );
  const familyIncomeSecondScenario = numeral(
    customGet(secondScenario, `${party}SpousalSupport.income.adjustedFamilyIncome`, 0) +
      spousalSecondScenario,
  );
  const familyIncomeThirdScenario = numeral(
    customGet(thirdScenario, `${party}SpousalSupport.income.adjustedFamilyIncome`, 0) +
      spousalThirdScenario,
  );

  return (
    <React.Fragment>
      <div className='person-table-title clearfix'>
        <span className='float-left text-truncate'>
          {`${supportProfile?.firstName} ${supportProfile?.lastName || ''}`}
        </span>
        <span className='text-capitalize float-right'>
          <em>
            {`${customGet(
              supportProfile,
              'gender',
            )?.toLowerCase()}, ${clientAge}, Resident of ${customGet(supportProfile, 'residence')}`}
          </em>
        </span>
      </div>

      {showSpousalSupport && (
        <div className='details-row row justify-content-end'>
          <span className='tax-row-label'>SSAG Spousal Scenario</span>
          <span className='tax-row-amount'>{agreedSpousalSupport ? 'Agreed' : 'Low'}</span>
          <span className='tax-row-amount'>{agreedSpousalSupport ? 'Low' : 'Mid'}</span>
          <span className='tax-row-amount'>High</span>
        </div>
      )}

      <div className='details-row-title'>Income</div>
      {incomes.length > 0 ? (
        incomes.map((income, index) => (
          <div className='details-row row justify-content-end' key={index}>
            <span className='tax-row-label'>
              &nbsp;&nbsp;&nbsp;
              {income.label}
            </span>
            <span className='tax-row-amount'>
              {numeral(
                customGet(firstScenario, `${party}SpousalSupport.income.all.${index}.amount`, 0),
              ).format('($0,0')}
            </span>
            {showSpousalSupport && (
              <React.Fragment>
                <span className='tax-row-amount'>
                  {numeral(
                    customGet(
                      secondScenario,
                      `${party}SpousalSupport.income.all.${index}.amount`,
                      0,
                    ),
                  ).format('($0,0')}
                </span>
                <span className='tax-row-amount'>
                  {numeral(
                    customGet(
                      thirdScenario,
                      `${party}SpousalSupport.income.all.${index}.amount`,
                      0,
                    ),
                  ).format('($0,0')}
                </span>
              </React.Fragment>
            )}
          </div>
        ))
      ) : (
        <div className='details-row row justify-content-end'>
          <span className='tax-row-label'>N/A</span>
        </div>
      )}

      {showSpousalSupport && (
        <div className='details-row row justify-content-end'>
          <span className='tax-row-label'>Spousal Support</span>
          <span className='tax-row-amount'>{numeral(spousalFirstScenario).format('($0,0')}</span>
          <span className='tax-row-amount'>{numeral(spousalSecondScenario).format('($0,0')}</span>
          <span className='tax-row-amount'>{numeral(spousalThirdScenario).format('($0,0')}</span>
        </div>
      )}

      <div className='details-row row justify-content-end'>
        <span className='tax-row-label'>Line 15000 Income</span>
        <span className='tax-row-amount'>{line1500FirstScenario.format('($0,0')}</span>
        {showSpousalSupport && (
          <React.Fragment>
            <span className='tax-row-amount'>{line1500SecondScenario.format('($0,0')}</span>
            <span className='tax-row-amount'>{line1500ThirdScenario.format('($0,0')}</span>
          </React.Fragment>
        )}
      </div>

      <div className='details-row-title'>Tax & Deductions</div>
      <div className='details-row row justify-content-end'>
        <span className='tax-row-label'>Taxes & Deductions (Annual)</span>
        <span className='tax-row-amount'>
          {numeral(customGet(firstScenario, `${party}SpousalSupport.monthlyTax`, 0) * 12.0).format(
            '($0,0',
          )}
        </span>
        {showSpousalSupport && (
          <React.Fragment>
            <span className='tax-row-amount'>
              {numeral(
                customGet(secondScenario, `${party}SpousalSupport.monthlyTax`, 0) * 12.0,
              ).format('($0,0')}
            </span>
            <span className='tax-row-amount'>
              {numeral(
                customGet(thirdScenario, `${party}SpousalSupport.monthlyTax`, 0) * 12.0,
              ).format('($0,0')}
            </span>
          </React.Fragment>
        )}
      </div>

      {federalTaxAdjustments.length > 0 &&
        federalTaxAdjustments.map((adjustment, index) => (
          <div className='details-row row justify-content-end' key={index}>
            <span className='tax-row-label'>
              &nbsp;&nbsp;&nbsp;
              {adjustment.label}
            </span>
            <span className='tax-row-amount'>
              {numeral(
                customGet(
                  firstScenario,
                  `${party}SpousalSupport.federalTaxAdjustments.all.${index}.amount`,
                  0,
                ),
              ).format('($0,0')}
            </span>
            {showSpousalSupport && (
              <React.Fragment>
                <span className='tax-row-amount'>
                  {numeral(
                    customGet(
                      secondScenario,
                      `${party}SpousalSupport.federalTaxAdjustments.all.${index}.amount`,
                      0,
                    ),
                  ).format('($0,0')}
                </span>
                <span className='tax-row-amount'>
                  {numeral(
                    customGet(
                      thirdScenario,
                      `${party}SpousalSupport.federalTaxAdjustments.all.${index}.amount`,
                      0,
                    ),
                  ).format('($0,0')}
                </span>
              </React.Fragment>
            )}
          </div>
        ))}

      <div className='details-row row justify-content-end'>
        <span className='tax-row-label'>&nbsp;&nbsp;&nbsp;Federal Tax</span>
        <span className='tax-row-amount'>
          {numeral(customGet(firstScenario, `${party}SpousalSupport.federalTax`, 0)).format(
            '($0,0',
          )}
        </span>
        {showSpousalSupport && (
          <React.Fragment>
            <span className='tax-row-amount'>
              {numeral(customGet(secondScenario, `${party}SpousalSupport.federalTax`, 0)).format(
                '($0,0',
              )}
            </span>
            <span className='tax-row-amount'>
              {numeral(customGet(thirdScenario, `${party}SpousalSupport.federalTax`, 0)).format(
                '($0,0',
              )}
            </span>
          </React.Fragment>
        )}
      </div>

      {provincialTaxAdjustments.length > 0 &&
        provincialTaxAdjustments.map((adjustment, index) => (
          <div className='details-row row justify-content-end' key={index}>
            <span className='tax-row-label'>
              &nbsp;&nbsp;&nbsp;
              {adjustment.label}
            </span>
            <span className='tax-row-amount'>
              {numeral(
                customGet(
                  firstScenario,
                  `${party}SpousalSupport.provincialTaxAdjustments.all.${index}.amount`,
                  0,
                ),
              ).format('($0,0')}
            </span>
            {showSpousalSupport && (
              <React.Fragment>
                <span className='tax-row-amount'>
                  {numeral(
                    customGet(
                      secondScenario,
                      `${party}SpousalSupport.provincialTaxAdjustments.all.${index}.amount`,
                      0,
                    ),
                  ).format('($0,0')}
                </span>
                <span className='tax-row-amount'>
                  {numeral(
                    customGet(
                      thirdScenario,
                      `${party}SpousalSupport.provincialTaxAdjustments.all.${index}.amount`,
                      0,
                    ),
                  ).format('($0,0')}
                </span>
              </React.Fragment>
            )}
          </div>
        ))}

      <div className='details-row row justify-content-end'>
        <span className='tax-row-label'>&nbsp;&nbsp;&nbsp;Provincial Tax</span>
        <span className='tax-row-amount'>
          {numeral(customGet(firstScenario, `${party}SpousalSupport.provincialTax`, 0)).format(
            '($0,0',
          )}
        </span>
        {showSpousalSupport && (
          <React.Fragment>
            <span className='tax-row-amount'>
              {numeral(customGet(secondScenario, `${party}SpousalSupport.provincialTax`, 0)).format(
                '($0,0',
              )}
            </span>
            <span className='tax-row-amount'>
              {numeral(customGet(thirdScenario, `${party}SpousalSupport.provincialTax`, 0)).format(
                '($0,0',
              )}
            </span>
          </React.Fragment>
        )}
      </div>

      <div className='details-row row justify-content-end'>
        <span className='tax-row-label'>&nbsp;&nbsp;&nbsp;CPP & EI</span>
        <span className='tax-row-amount'>
          {numeral(customGet(firstScenario, `${party}SpousalSupport.cppEi`, 0)).format('($0,0')}
        </span>
        {showSpousalSupport && (
          <React.Fragment>
            <span className='tax-row-amount'>
              {numeral(customGet(secondScenario, `${party}SpousalSupport.cppEi`, 0)).format(
                '($0,0',
              )}
            </span>
            <span className='tax-row-amount'>
              {numeral(customGet(thirdScenario, `${party}SpousalSupport.cppEi`, 0)).format('($0,0')}
            </span>
          </React.Fragment>
        )}
      </div>

      <div className='details-row row justify-content-end'>
        <span className='tax-row-label'>Taxes & Deductions (Monthly)</span>
        <span className='tax-row-amount'>
          {numeral(customGet(firstScenario, `${party}SpousalSupport.monthlyTax`, 0)).format(
            '($0,0',
          )}
        </span>
        {showSpousalSupport && (
          <React.Fragment>
            <span className='tax-row-amount'>
              {numeral(customGet(secondScenario, `${party}SpousalSupport.monthlyTax`, 0)).format(
                '($0,0',
              )}
            </span>
            <span className='tax-row-amount'>
              {numeral(customGet(thirdScenario, `${party}SpousalSupport.monthlyTax`, 0)).format(
                '($0,0',
              )}
            </span>
          </React.Fragment>
        )}
      </div>

      <div className='details-row-title'>Federal Tax Deductions</div>

      {federalTaxDeductions.length > 0 ? (
        federalTaxDeductions.map((amount, index) => (
          <TaxProfileRow
            key={index}
            amount={amount}
            index={index}
            amountType='federalDeductions'
            party={party}
            scenarios={scenarios}
            agreedSpousalSupport={agreedSpousalSupport}
            showSpousalSupport={showSpousalSupport}
          />
        ))
      ) : (
        <div className='details-row row justify-content-end'>
          <span className='tax-row-label'>N/A</span>
        </div>
      )}

      <div className='details-row-title'>Provincial Tax Deductions</div>

      {provincialTaxDeductions.length > 0 ? (
        provincialTaxDeductions.map((amount, index) => (
          <TaxProfileRow
            key={index}
            amount={amount}
            index={index}
            amountType='provincialDeductions'
            party={party}
            scenarios={scenarios}
            agreedSpousalSupport={agreedSpousalSupport}
            showSpousalSupport={showSpousalSupport}
          />
        ))
      ) : (
        <div className='details-row row justify-content-end'>
          <span className='tax-row-label'>N/A</span>
        </div>
      )}

      <div className='details-row row justify-content-end'>
        <span className='tax-row-label'>Line 26000 Income</span>
        <span className='tax-row-amount'>
          {numeral(
            customGet(firstScenario, `${party}SpousalSupport.income.federalTaxableIncome`, 0),
          ).format('($0,0')}
        </span>
        {showSpousalSupport && (
          <React.Fragment>
            <span className='tax-row-amount'>
              {numeral(
                customGet(secondScenario, `${party}SpousalSupport.income.federalTaxableIncome`, 0),
              ).format('($0,0')}
            </span>
            <span className='tax-row-amount'>
              {numeral(
                customGet(thirdScenario, `${party}SpousalSupport.income.federalTaxableIncome`, 0),
              ).format('($0,0')}
            </span>
          </React.Fragment>
        )}
      </div>

      <div className='details-row-title'>Federal Tax Credits</div>

      {federalTaxCredits.length > 0 ? (
        federalTaxCredits.map((amount, index) => (
          <TaxProfileRow
            key={index}
            amount={amount}
            index={index}
            amountType='federalCredits'
            party={party}
            scenarios={scenarios}
            agreedSpousalSupport={agreedSpousalSupport}
            showSpousalSupport={showSpousalSupport}
            fieldLabel='Credits'
          />
        ))
      ) : (
        <div className='details-row row justify-content-end'>
          <span className='tax-row-label'>N/A</span>
        </div>
      )}

      <div className='details-row-title'>Provincial Tax Credits</div>

      {provincialTaxCredits.length > 0 ? (
        provincialTaxCredits.map((amount, index) => (
          <TaxProfileRow
            key={index}
            amount={amount}
            index={index}
            amountType='provincialCredits'
            party={party}
            scenarios={scenarios}
            agreedSpousalSupport={agreedSpousalSupport}
            showSpousalSupport={showSpousalSupport}
            fieldLabel='Credits'
          />
        ))
      ) : (
        <div className='details-row row justify-content-end'>
          <span className='tax-row-label'>N/A</span>
        </div>
      )}

      <div className='details-row-title'>Federal Benefits</div>

      <div className='details-row row justify-content-end'>
        <span className='tax-row-label'>Family Net Income</span>
        <span className='tax-row-amount'>{familyIncomeFirstScenario.format('($0,0')}</span>
        {showSpousalSupport && (
          <React.Fragment>
            <span className='tax-row-amount'>{familyIncomeSecondScenario.format('($0,0')}</span>
            <span className='tax-row-amount'>{familyIncomeThirdScenario.format('($0,0')}</span>
          </React.Fragment>
        )}
      </div>

      {federalBenefits.length > 0 ? (
        federalBenefits.map((amount, index) => (
          <TaxProfileRow
            key={index}
            amount={amount}
            index={index}
            amountType='federalBenefits'
            party={party}
            scenarios={scenarios}
            agreedSpousalSupport={agreedSpousalSupport}
            showSpousalSupport={showSpousalSupport}
          />
        ))
      ) : (
        <div className='details-row row justify-content-end'>
          <span className='tax-row-label'>N/A</span>
        </div>
      )}

      <div className='details-row row justify-content-end'>
        <span className='tax-row-label'>Total Federal Benefits</span>
        <span className='tax-row-amount'>
          {numeral(
            customGet(firstScenario, `${party}SpousalSupport.federalBenefits.total`, 0),
          ).format('($0,0')}
        </span>
        {showSpousalSupport && (
          <React.Fragment>
            <span className='tax-row-amount'>
              {numeral(
                customGet(secondScenario, `${party}SpousalSupport.federalBenefits.total`, 0),
              ).format('($0,0')}
            </span>
            <span className='tax-row-amount'>
              {numeral(
                customGet(thirdScenario, `${party}SpousalSupport.federalBenefits.total`, 0),
              ).format('($0,0')}
            </span>
          </React.Fragment>
        )}
      </div>

      <div className='details-row-title'>Provincial Benefits</div>

      {provincialBenefits.length > 0 ? (
        provincialBenefits.map((amount, index) => (
          <TaxProfileRow
            key={index}
            amount={amount}
            index={index}
            amountType='provincialBenefits'
            party={party}
            scenarios={scenarios}
            agreedSpousalSupport={agreedSpousalSupport}
            showSpousalSupport={showSpousalSupport}
          />
        ))
      ) : (
        <div className='details-row row justify-content-end'>
          <span className='tax-row-label'>N/A</span>
        </div>
      )}

      <div className='details-row row justify-content-end'>
        <span className='tax-row-label'>Total Provincial Benefits</span>
        <span className='tax-row-amount'>
          {numeral(customGet(firstScenario, `${party}SpousalSupport.provincialBenefits`, 0)).format(
            '($0,0',
          )}
        </span>
        {showSpousalSupport && (
          <React.Fragment>
            <span className='tax-row-amount'>
              {numeral(
                customGet(secondScenario, `${party}SpousalSupport.provincialBenefits`, 0),
              ).format('($0,0')}
            </span>
            <span className='tax-row-amount'>
              {numeral(
                customGet(thirdScenario, `${party}SpousalSupport.provincialBenefits`, 0),
              ).format('($0,0')}
            </span>
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
};

export default TaxProfileTable;
