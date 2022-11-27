/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useMemo } from 'react';

import numeral from 'numeral';

import CardHeader from 'components/calculations/components/CardHeader';

import allTaxTables from 'utils/taxTables';
import customGet from 'utils/get';
import toUSD from 'utils/toUSD';

const format = (obj, path) => numeral(customGet(obj, path, 0)).format('($0,0');

const DetailedInputs = ({
  index,
  clientName,
  exName,
  supportCalculation,
  childSupport,
  showChildSupport,
  showSpousalSupport,
  childrenArr,
}) => {
  const taxTables = useMemo(() => allTaxTables[supportCalculation?.taxYear], [supportCalculation]);

  const clientAdjustmentsRaw = customGet(
    supportCalculation,
    'clientSupportProfile.adjustments.all',
    [],
  );
  const clientAdjustments = clientAdjustmentsRaw.map(adjustment => ({
    ...adjustment,
    clientAmount: adjustment.amount,
  }));

  const exAdjustmentsRaw = customGet(supportCalculation, 'exSupportProfile.adjustments.all', []);
  const exAdjustments = exAdjustmentsRaw.map(adjustment => ({
    ...adjustment,
    exAmount: adjustment.amount,
  }));

  const adjustments = useMemo(
    () => [...clientAdjustments, ...exAdjustments],
    [clientAdjustments, exAdjustments],
  );

  const clientHardshipRaw = customGet(supportCalculation, 'clientSupportProfile.hardship.all', []);
  const clientHardship = clientHardshipRaw.map((key, amount) => ({
    key,
    clientAmount: amount,
  }));
  const exHardshipRaw = customGet(supportCalculation, 'exSupportProfile.hardship.all', []);
  const exHardship = exHardshipRaw.map((key, amount) => ({
    key,
    exAmount: amount,
  }));
  const hardships = useMemo(
    () => ({ ...clientHardship, ...exHardship }),
    [clientHardship, exHardship],
  );

  const clientSpousalGuidelineIncome = numeral(
    customGet(
      supportCalculation,
      'calculationResult.spousalSupport.scenarios[0].clientSpousalSupport.monthlyGuidelineIncome',
      0,
    ) * 12.0,
  ).format('($0,0');

  const exSpousalGuidelineIncome = numeral(
    customGet(
      supportCalculation,
      'calculationResult.spousalSupport.scenarios[0].clientSpousalSupport.monthlyGuidelineIncome',
      0,
    ) * 12.0,
  ).format('($0,0');

  const displayAdjustments = useMemo(
    () =>
      adjustments.length > 0
        ? adjustments.map(adjustment => ({
            name: taxTables?.adjustments?.find(({ key }) => key === adjustment.key)?.label,
            client: numeral(adjustment.clientAmount || 0).format('($0,0'),
            ex: numeral(adjustment.exAmount || 0).format('($0,0'),
          }))
        : [],
    [adjustments, taxTables?.adjustments],
  );

  const displayHardships = useMemo(
    () =>
      hardships.length > 0
        ? hardships.map(hardship => ({
            name: taxTables?.hardships?.find(({ key }) => key === hardship.key)?.label,
            client: numeral(hardship.clientAmount || 0).format('($0,0'),
            ex: numeral(hardship.exAmount || 0).format('($0,0'),
          }))
        : [],
    [hardships, taxTables?.hardships],
  );

  const rows = useMemo(
    () =>
      [
        {
          name: 'Birth Date',
          client: new Date(
            customGet(supportCalculation, 'clientSupportProfile.birthDate'),
          ).toLocaleDateString(),
          ex: new Date(
            customGet(supportCalculation, 'exSupportProfile.birthDate'),
          ).toLocaleDateString(),
        },
        {
          name: 'Residence',
          client: customGet(supportCalculation, 'clientSupportProfile.residence', 'N/A'),
          ex: customGet(supportCalculation, 'exSupportProfile.residence', 'N/A'),
        },
        {
          name: 'Employment Income',
          client: format(childSupport, 'clientChildSupport.employmentIncome'),
          ex: format(childSupport, 'exChildSupport.employmentIncome'),
        },
        {
          name: 'Line 15000 Income',
          client: format(
            supportCalculation,
            'calculationResult.spousalSupport.scenarios[3].clientSpousalSupport.income.total',
          ),
          ex: format(
            supportCalculation,
            'calculationResult.spousalSupport.scenarios[3].exSpousalSupport.income.total',
          ),
        },
        {
          name: 'Family Net Income',
          client: format(
            supportCalculation,
            'calculationResult.spousalSupport.scenarios[3].clientSpousalSupport.income.adjustedFamilyIncome',
          ),
          ex: format(
            supportCalculation,
            'calculationResult.spousalSupport.scenarios[3].exSpousalSupport.income.adjustedFamilyIncome',
          ),
        },
        adjustments.length > 0 && { heading: 'Guideline Income Adjustments*' },
        ...displayAdjustments,
        hardships.length > 0 && { heading: 'Undue Hardship Claims**' },
        ...displayHardships,
        (adjustments.length > 0 || hardships.length > 0) && { heading: 'Guideline Income' },
        showSpousalSupport && {
          name: 'Spousal Support Guideline Income',
          client: clientSpousalGuidelineIncome,
          ex: exSpousalGuidelineIncome,
        },
        showChildSupport && {
          name: 'Child Support Guideline Income',
          client: format(childSupport, 'clientChildSupport.guidelineIncome'),
          ex: format(childSupport, 'exChildSupport.guidelineIncome'),
        },
      ].filter(r => r),
    [
      childSupport,
      supportCalculation,
      showChildSupport,
      showSpousalSupport,
      adjustments,
      hardships,
      clientSpousalGuidelineIncome,
      exSpousalGuidelineIncome,
      displayAdjustments,
      displayHardships,
    ],
  );
  return (
    <div className='support-report-page'>
      <CardHeader
        text={`${index}. Detailed Inputs`}
        src='./img/icons/dusk/png/accounting.png'
        avatarContent='basis of support calculation'
        report
      />

      <div className='calculator-section'>
        <p>
          The tables below set out the information on which this report is based, and with which
          support is calculated in this report. Changing these inputs will change the support
          calculation. All inputs should be verified for accuracy.
        </p>

        <h6 className='mt-4'>Parties</h6>

        <p>
          The parties' age, residence and income can affect the net disposable income calculation.
          The key inputs are shown below.
        </p>

        <div className='row'>
          <div className='col-12'>
            <table className='table table-striped'>
              <thead>
                <tr>
                  <th scope='col' />
                  <th scope='col'>{clientName}</th>
                  <th scope='col'>{exName}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ name, client, ex, heading }) =>
                  heading ? (
                    <tr>
                      <th scope='row' colSpan={3}>
                        {heading}
                      </th>
                    </tr>
                  ) : (
                    <tr key={name}>
                      <th scope='row'>{name}</th>
                      <td>{client}</td>
                      <td>{ex}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>

        {adjustments.length > 0 && (
          <p>
            <em>
              *Guideline Income Adjustments are manual adjustments to Guideline Income in accordance
              with the Child Support Guidelines, or the Spousal Support Advisory Guidelines, or
              both. For more information, visit the help centre.
            </em>
          </p>
        )}

        {hardships.length > 0 && (
          <p>
            <em>
              *Undue Hardship may be claimed under the Child Support Guidelines or Spousal Support
              Advisory Guidelines, or both. These claims do not affect the amount of support shown
              in this report but may be taken into consideration by the court when determining the
              amount of support. For more information, visit the help centre.
            </em>
          </p>
        )}

        {childrenArr?.length > 0 && (
          <React.Fragment>
            <h6 className='mt-5'>Children</h6>

            <p>
              The age, parenting arrangement, and which parent claims each child for tax purposes
              affects child support and net income calculations.
            </p>

            <div className='row'>
              <div className='col-8'>
                <table className='table table-striped'>
                  <thead>
                    <tr>
                      <th scope='col' />
                      {childrenArr?.map(child => (
                        <th scope='col' key={child?.id}>
                          {child?.firstName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope='row'>Birth Date</th>
                      {childrenArr?.map(child => (
                        <td key={child?.id}>
                          {new Date(child?.birthDate).toLocaleDateString() || 'N/A'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <th scope='row'>Child Of Relationship*</th>
                      {childrenArr?.map(child => (
                        <td key={child?.id}>{child?.isOfRelationship ? 'yes' : 'no'}</td>
                      ))}
                    </tr>
                    <tr>
                      <th scope='row'>Child is Dependent</th>
                      {childrenArr?.map(child => (
                        <td key={child?.id}>{child?.isDependent ? 'yes' : 'no'}</td>
                      ))}
                    </tr>
                    <tr>
                      <th scope='row'>Primary Parenting</th>
                      {childrenArr?.map(child => (
                        <td key={child?.id}>
                          {child?.isOfRelationship
                            ? child?.isDependent
                              ? child?.parenting?.toLowerCase()
                              : 'N/A'
                            : 'N/A'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <th scope='row'>Claim for Tax Purposes</th>
                      {childrenArr?.map((child, i) => (
                        <td key={child?.id}>
                          {child?.isOfRelationship
                            ? child?.isDependent
                              ? child?.claimAsDependent?.toLowerCase() ||
                                supportCalculation?.calculationResult?.spousalSupport?.claimAsDependentDefault?.[
                                  i
                                ]?.toLowerCase() ||
                                'N/A'
                              : 'N/A'
                            : 'N/A'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <th scope='row'>Support Type</th>
                      {childrenArr?.map(child => (
                        <td key={child?.id}>
                          {child?.isDependent && child?.isOfRelationship
                            ? child?.supportType
                            : 'N/A'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <th scope='row'>Child has a disability</th>
                      {childrenArr?.map(child => (
                        <td key={child?.id}>{child?.disabled ? 'yes' : 'no'}</td>
                      ))}
                    </tr>
                    <tr>
                      <th scope='row'>Child income</th>
                      {childrenArr?.map(child => (
                        <td key={child?.id}>{toUSD(child?.childIncome || 0)}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <p>
              <em>
                *Only "children of the relationship" are included in the calculation of child
                support, however the cost of supporting the child may be deducted from guideline
                income in certain circumstances. See the adjustments section, above.
              </em>
            </p>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default DetailedInputs;
