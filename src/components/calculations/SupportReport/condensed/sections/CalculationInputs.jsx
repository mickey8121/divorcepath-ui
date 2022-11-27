import React, { useMemo } from 'react';

import dayjs from 'dayjs';
import { startCase } from 'lodash';

import CalculationInputsRow from 'components/calculations/SupportReport/components/condensed/CalculationInputs';

import customGet from 'utils/get';
import allTaxTables from 'utils/taxTables';
import toUSD from 'utils/toUSD';

const paths = ['exSpousalSupport', 'clientSpousalSupport'];

const CalculationInputs = ({
  supportCalculation,
  clientFirstName,
  exFirstName,
  clientSupportProfile,
  exSupportProfile,
  clientChildExpenses,
  exChildExpenses,
  showChildSupportResults,
  childrenArr,
  spousalSupport,
  scenarios,
}) => {
  const TaxYear = useMemo(() => allTaxTables[supportCalculation?.taxYear], [supportCalculation]);

  const clientIncomes = supportCalculation?.clientSupportProfile?.income.all;
  const exIncomes = supportCalculation?.exSupportProfile?.income.all;
  // const clientIncomes = customGet(scenarios[3], 'clientSpousalSupport.income.all', []);
  // const exIncomes = customGet(scenarios[3], 'exSpousalSupport.income.all', []);
  const clientAdjustments = customGet(
    supportCalculation,
    'clientSupportProfile.adjustments.all',
    [],
  );
  const exAdjustments = customGet(supportCalculation, 'exSupportProfile.adjustments.all', []);
  const clientHardship = customGet(supportCalculation, 'clientSupportProfile.hardship.all', []);
  const exHardship = customGet(supportCalculation, 'exSupportProfile.hardship.all', []);

  const hasChildren = !!childrenArr?.length;

  const exChildBenefits = childrenArr?.find(
    child =>
      child.isOfRelationship === true &&
      (child.claimAsDependent === 'EX' ||
        (child.claimAsDependent === null &&
          supportCalculation?.calculationResult?.spousalSupport?.claimAsDependentDefault?.includes(
            'EX',
          ))),
  );

  const clientChildBenefits = childrenArr?.find(
    child =>
      child.isOfRelationship === true &&
      (child.claimAsDependent === 'CLIENT' ||
        (child.claimAsDependent === null &&
          supportCalculation?.calculationResult?.spousalSupport?.claimAsDependentDefault?.includes(
            'CLIENT',
          ))),
  );

  const sharedChildBenefits = childrenArr.find(
    child =>
      child.isOfRelationship === true &&
      (child.claimAsDependent === 'SHARED' ||
        (child.claimAsDependent === null &&
          supportCalculation?.calculationResult?.spousalSupport?.claimAsDependentDefault?.includes(
            'SHARED',
          ))),
  );

  const childBenefits = useMemo(() => {
    if (sharedChildBenefits) return 'are shared by both parties';
    if (exChildBenefits) {
      if (clientChildBenefits) return 'are split between both parties';
      return `claimed by ${exFirstName}`;
    }
    if (clientChildBenefits) return `claimed by ${clientFirstName}`;
    return 'not claimed by either party for this calculation';
  }, [sharedChildBenefits, exChildBenefits, clientChildBenefits, exFirstName, clientFirstName]);

  const [exDependentCredit, clientDependentCredit] = paths.map(
    p =>
      !!customGet(scenarios[3], `${p}.federalCredits.all`, []).find(
        amount => amount.key === 'eligible_dependant',
      ),
  );

  const dependentCredit = useMemo(() => {
    if (exDependentCredit) {
      if (clientDependentCredit) return 'both parties';

      return exFirstName;
    }

    return clientFirstName;
  }, [clientFirstName, exFirstName, exDependentCredit, clientDependentCredit]);

  const hasDisability = !!childrenArr?.find(child => child?.disabled);

  return (
    <div className='col-6'>
      <div className='bg-dark p-2'>
        <h6 className='text-white mb-0'>
          <strong>Calculation Inputs</strong>
        </h6>
      </div>

      <div className='person-table-title'>
        {clientFirstName}
        <span className='text-capitalize float-right'>
          <em>
            {startCase(customGet(supportCalculation, 'clientSupportProfile.gender'))},
            {` ${dayjs().diff(customGet(clientSupportProfile, 'birthDate', ''), 'years')}`},
            Resident of {customGet(supportCalculation, 'clientSupportProfile.residence')}
          </em>
        </span>
      </div>

      <CalculationInputsRow
        labels={TaxYear?.income}
        inputs={clientIncomes}
        path='userAmount'
        title='Income'
      />

      {hasChildren && clientChildExpenses.length > 0 && (
        <CalculationInputsRow
          labels={TaxYear?.child_expenses}
          inputs={clientChildExpenses}
          path='userInputs[0].floatData'
          title='Special Expenses'
          type='client'
        />
      )}
      {clientAdjustments?.length > 0 && (
        <CalculationInputsRow
          labels={TaxYear?.adjustments}
          inputs={clientAdjustments}
          path='userAmount'
          title='Guideline Income Adjustments'
        />
      )}
      {clientHardship?.length > 0 && (
        <CalculationInputsRow
          labels={TaxYear?.hardship}
          inputs={clientHardship}
          path='userAmount'
          title='Undue Hardship Claim'
        />
      )}

      <div className='person-table-title mt-3 border-top-1'>
        {exFirstName}
        <span className='text-capitalize float-right'>
          <em>
            {startCase(customGet(supportCalculation, 'exSupportProfile.gender'))},
            {` ${dayjs().diff(customGet(exSupportProfile, 'birthDate', ''), 'years')}`}, of{' '}
            {customGet(supportCalculation, 'exSupportProfile.residence')}
          </em>
        </span>
      </div>

      <CalculationInputsRow
        labels={TaxYear?.income}
        inputs={exIncomes}
        path='userAmount'
        title='Income'
      />

      {hasChildren && exChildExpenses?.length > 0 && (
        <CalculationInputsRow
          labels={TaxYear?.child_expenses}
          inputs={exChildExpenses}
          path='userInputs[1].floatData'
          title='Special Expenses'
          type='ex'
        />
      )}
      {exAdjustments?.length > 0 && (
        <CalculationInputsRow
          labels={TaxYear?.adjustments}
          inputs={exAdjustments}
          path='userAmount'
          title='Guideline Income Adjustments'
        />
      )}
      {exHardship?.length > 0 && (
        <CalculationInputsRow
          labels={TaxYear?.hardship}
          inputs={exHardship}
          path='userAmount'
          title='Undue Hardship Claim'
        />
      )}

      {showChildSupportResults && (
        <React.Fragment>
          <table className='table table-striped table-responsive mt-4 children-table mb-1'>
            <thead>
              <tr>
                <th scope='col' style={{ paddingLeft: '10px' }}>
                  Children
                </th>
                <th scope='col' style={{ paddingLeft: '10px' }} className='text-capitalize'>
                  <em>Age</em>
                </th>
                <th scope='col' style={{ paddingLeft: '10px' }} className='text-capitalize'>
                  <em>Lives with</em>
                </th>
                <th scope='col' style={{ paddingLeft: '10px' }} className='text-capitalize'>
                  <em>Claim Support</em>
                </th>
                <th scope='col' style={{ paddingLeft: '10px' }} className='text-capitalize'>
                  <em>Benefits</em>
                </th>
              </tr>
            </thead>
            <tbody>
              {childrenArr?.map((child, index) => (
                <tr key={child?.id}>
                  <th scope='row' style={{ paddingLeft: '10px' }} index={index}>
                    {child?.firstName?.trim()}
                    {child?.disabled ? '*' : ''}
                  </th>
                  <td>{dayjs().diff(child?.birthDate, 'years')}</td>
                  <td className='text-capitalize'>
                    {child?.isOfRelationship
                      ? child?.isDependent
                        ? child?.parenting?.toLowerCase()
                        : 'N/A'
                      : 'N/A'}
                  </td>
                  <td>{child?.isOfRelationship ? (child?.isDependent ? 'Yes' : 'No') : 'No'}</td>
                  <td className='text-capitalize'>
                    {child?.claimAsDependent ||
                      supportCalculation?.calculationResult?.spousalSupport?.claimAsDependentDefault?.[
                        index
                      ]?.toLowerCase() ||
                      'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {hasDisability && (
            <p className='mb-2'>
              <small>* child has a disability</small>
            </p>
          )}
          {childrenArr?.map(child => {
            if (!child?.childIncome) return null;

            return (
              <p key={child?.id} className='mb-0'>
                <small>
                  {child?.firstName?.trim()} income: {toUSD(child?.childIncome)}
                </small>
              </p>
            );
          })}
          <p className='my-2'>
            <small>
              Youngest child attends full time school{' '}
              {customGet(spousalSupport, 'yearsUntilStartSchool')} years and finishes high{' '}
              {customGet(spousalSupport, 'yearsUntilEndSchool')} years from the date of separation.
            </small>
          </p>
          <p>
            <small>
              Dependant credit claimed by {dependentCredit}. Child benefits {childBenefits}.
              Complete tax profile information (credits, deductions & benefits) is set out at the
              end of this report.
            </small>
          </p>
        </React.Fragment>
      )}
    </div>
  );
};

export default CalculationInputs;
