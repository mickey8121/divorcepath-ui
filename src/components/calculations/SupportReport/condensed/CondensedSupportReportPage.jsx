import React, { Fragment, useMemo } from 'react';

import ReportHeader from 'components/calculations/SupportReport/condensed/sections/ReportHeader';
import CalculationInputs from 'components/calculations/SupportReport/condensed/sections/CalculationInputs';
import Guidelines from 'components/calculations/SupportReport/condensed/sections/Guidelines';
import ChildS3 from 'components/calculations/SupportReport/condensed/sections/ChildS3';
import Formulas from 'components/calculations/SupportReport/condensed/sections/Formulas';
import TaxProfileTable from 'components/calculations/SupportReport/components/TaxProfileTable';
import CalculationDetailsTable from 'components/calculations/SupportReport/components/CalculationDetailsTable';
import SpecialExpensesTable from 'components/calculations/SupportReport/components/SpecialExpensesTable';
import SupportScenariosTable from 'components/calculations/SupportReport/components/SupportScenariosTable';
import MonthlyBudgetTable from 'components/calculations/SupportReport/components/MonthlyBudgetTable';
import CondensedSupportReportStyle from 'components/calculations/SupportReport/condensedStyles';

import customGet from 'utils/get';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CondensedSupportReportPage = ({
  professional,
  supportCalculation,
  supportCalculationResult,
}) => {
  const childSupport = customGet(supportCalculationResult, 'childSupport', {});
  const showSpousalSupport = supportCalculation?.showSpousalSupport;

  const clientFirstName = supportCalculation?.clientSupportProfile?.firstName;
  const clientLastName = supportCalculation?.clientSupportProfile?.lastName;
  const exFirstName = supportCalculation?.exSupportProfile?.firstName;
  const exLastName = supportCalculation?.exSupportProfile?.lastName;

  const children = supportCalculation?.children || [];
  const showChildSupportResults = !!(supportCalculation?.showChildSupport && children.length > 0);

  const spousalSupport = supportCalculationResult?.spousalSupport;
  const agreedSpousalSupport =
    supportCalculation?.agreedSpousalSupport < 0 ? null : supportCalculation?.agreedSpousalSupport;

  const clientSupportProfile = customGet(supportCalculation, 'clientSupportProfile', {});
  const exSupportProfile = customGet(supportCalculation, 'exSupportProfile', {});

  const scenarios = customGet(spousalSupport, 'scenarios', []);
  const payor = customGet(spousalSupport, 'payor', '');
  const payorName = customGet(supportCalculation, `${payor}SupportProfile.firstName`, '');
  const taxYear = customGet(supportCalculation, 'taxYear', '2021');
  const reportTitle = useMemo(() => {
    if (showSpousalSupport && !showChildSupportResults)
      return `Spousal Support Report - ${taxYear}`;
    if (!showSpousalSupport) return `Child Support Report - ${taxYear}`;

    return `Child Support & Spousal Support Report - ${taxYear}`;
  }, [showChildSupportResults, showSpousalSupport, taxYear]);

  // check for exceptions/cautions to the formulas to display warnings
  const csPayorIncomeAboveCeiling =
    customGet(childSupport, `${payor}ChildSupport.guidelineIncome`, 0) > 150000;
  const ssPayorIncomeAboveCeiling =
    customGet(scenarios[3], `${payor}SpousalSupport.monthlyGuidelineIncome`, 0) * 12.0 > 350000;
  const ssPayorIncomeBelowFloor =
    customGet(scenarios[3], `${payor}SpousalSupport.monthlyGuidelineIncome`, 0) * 12.0 < 20000;
  const ssPayorIncomeLowRange = !!(
    !ssPayorIncomeBelowFloor &&
    customGet(scenarios[3], `${payor}SpousalSupport.monthlyGuidelineIncome`, 0) * 12.0 < 30000
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

  // get array of special expenses paid by client and amount
  const childExpenses = customGet(supportCalculation, 'childExpenses.all', []);
  const clientChildExpenses = childExpenses.filter(
    expense => expense.userInputs.find(u => u.name === 'client').floatData > 0,
  );
  const exChildExpenses = childExpenses.filter(
    expense => expense.userInputs.find(u => u.name === 'ex').floatData > 0,
  );

  const formula = showSpousalSupport ? customGet(spousalSupport, 'formula') : 'No Spousal';

  const show =
    (!showChildSupportResults || !csPayorIncomeAboveCeiling) &&
    (!showSpousalSupport ||
      (!ssPayorIncomeAboveCeiling && !ssPayorIncomeBelowFloor && !ssPayorIncomeLowRange));

  const npvDiscountRate = customGet(supportCalculation, 'npvDiscountRate')
    ? customGet(supportCalculation, 'npvDiscountRate')
    : 4;

  const userDuration = customGet(supportCalculation, 'npvDuration');
  const defaultDuration =
    ((customGet(spousalSupport, 'minDuration', 0) + customGet(spousalSupport, 'maxDuration', 0)) *
      12.0) /
    2;
  const capDuration = 120;
  const npvDuration =
    userDuration === undefined
      ? defaultDuration > 1000
        ? capDuration
        : defaultDuration
      : userDuration;

  const indefiniteDuration = spousalSupport?.minDuration > 99;

  if (!supportCalculationResult) return null;

  return (
    <CondensedSupportReportStyle>
      <div className='report-layout'>
        <ReportHeader
          professional={professional}
          reportTitle={reportTitle}
          clientFirstName={clientFirstName}
          exFirstName={exFirstName}
          clientLastName={clientLastName}
          exLastName={exLastName}
        />
        <div className='row pl-3 pr-3'>
          <CalculationInputs
            supportCalculation={supportCalculation}
            clientFirstName={clientFirstName}
            exFirstName={exFirstName}
            clientSupportProfile={clientSupportProfile}
            exSupportProfile={exSupportProfile}
            clientChildExpenses={clientChildExpenses}
            exChildExpenses={exChildExpenses}
            showChildSupportResults={showChildSupportResults}
            childrenArr={children}
            spousalSupport={spousalSupport}
            scenarios={scenarios}
          />

          <Guidelines
            supportCalculation={supportCalculation}
            showChildSupportResults={showChildSupportResults}
            clientChildExpenses={clientChildExpenses}
            exChildExpenses={exChildExpenses}
            childSupport={childSupport}
            clientFirstName={clientFirstName}
            exFirstName={exFirstName}
            childExpenses={childExpenses}
            showSpousalSupport={showSpousalSupport}
            agreedSpousalSupport={agreedSpousalSupport}
            spousalSupport={spousalSupport}
            formula={formula}
            scenarios={scenarios}
            payor={payor}
          />

          {showSpousalSupport && (
            <div className='no-break reportBody pb-3'>
              <div className='bg-dark p-2 mb-3'>
                <h6 className='text-white mb-0'>
                  <strong>Support Scenarios</strong>
                </h6>
              </div>
              <SupportScenariosTable
                spousalSupport={spousalSupport}
                clientName={clientFirstName}
                exName={exFirstName}
                agreedSpousalSupport={agreedSpousalSupport}
                showChildSupportResults={showChildSupportResults}
              />
            </div>
          )}

          {showChildSupportResults && (
            <ChildS3
              clientFirstName={clientFirstName}
              exFirstName={exFirstName}
              childSupport={childSupport}
            />
          )}
        </div>

        {showChildSupportResults && (
          <div className='reportBody'>
            <div className='bg-dark p-2 mb-3'>
              <h6 className='text-white mb-0'>
                <strong>Special Expenses (s. 7 CSG) Calculation Details</strong>
              </h6>
            </div>
            <SpecialExpensesTable
              spousalSupport={spousalSupport}
              clientName={clientFirstName}
              exName={exFirstName}
              showSpousalSupport={showSpousalSupport}
              agreedSpousalSupport={agreedSpousalSupport}
            />
          </div>
        )}

        {showSpousalSupport && (
          <React.Fragment>
            <div className='no-break reportBody'>
              <div className='bg-dark p-2 mb-3'>
                <h6 className='text-white mb-0'>
                  <strong>Spousal Support (SSAG) Calculation Details</strong>
                </h6>
              </div>
              <CalculationDetailsTable
                spousalSupport={spousalSupport}
                clientName={clientFirstName}
                exName={exFirstName}
                showSpousalSupport={showSpousalSupport}
                agreedSpousalSupport={agreedSpousalSupport}
              />

              <p className='p-2'>
                <strong>*Lump Sum = net present value:</strong> The net present value of spousal
                support, i.e. lump sum support, is calculated based on an estimated duration of{' '}
                {Math.round(npvDuration || 0)} months and applying a {npvDiscountRate}% discount
                rate to approximate future inflation. This lump sum calculation assumes the lump sum
                payment is non-deductible and non-taxable to the payor/recipient, respectively. Note
                that this calculation assumes support payments, tax rates and government benefits
                remain constant for the estimated duration of support.
              </p>

              {formula !== 'With Children' && (
                <Fragment>
                  <div className='bg-dark p-2 mb-3'>
                    <h6 className='text-white mb-0'>
                      <strong>Spousal Support Formula Details</strong>
                    </h6>
                  </div>

                  <Formulas
                    clientFirstName={clientFirstName}
                    exFirstName={exFirstName}
                    childSupport={childSupport}
                    spousalSupport={spousalSupport}
                    agreedSpousalSupport={agreedSpousalSupport}
                    scenarios={scenarios}
                    showSpousalSupport={showSpousalSupport}
                  />
                </Fragment>
              )}

              <p className='p-2'>
                <strong>SSAG Issues:</strong> The following issues should be taken into
                consideration when interpreting SSAG formula results: entitlement to support; proper
                position within the ranges; restructuring; exceptions; and ceilings and floors (see
                end of this report).
              </p>
            </div>

            <div className='reportBody'>
              <div className='bg-dark p-2 mb-3'>
                <h6 className='text-white mb-0'>
                  <strong>Spousal Support Duration</strong>
                </h6>
              </div>
              <div className='row'>
                <div className='col-6'>
                  <table className='table table-striped'>
                    <tbody>
                      <tr>
                        <th scope='row'>Duration of Relationship</th>
                        <td>{spousalSupport?.durationOfRelationship}</td>
                      </tr>
                      <tr>
                        <th scope='row'>Age at Separation</th>
                        <td>{spousalSupport?.ageAtSeparation}</td>
                      </tr>
                      <tr>
                        <th scope='row'>Years Until Full-Time School</th>
                        <td>{spousalSupport?.yearsUntilStartSchool}</td>
                      </tr>
                      <tr>
                        <th scope='row'>Years Until End of School</th>
                        <td>{spousalSupport?.yearsUntilEndSchool}</td>
                      </tr>
                      <tr>
                        <th scope='row'>Over 20 Year Relationship</th>
                        <td>{spousalSupport?.twentyYearRelationship ? 'Yes' : 'No'}</td>
                      </tr>
                      <tr>
                        <th scope='row'>Rule of 65</th>
                        <td>{spousalSupport?.ruleOf65 ? 'Yes' : 'No'}</td>
                      </tr>
                      <tr>
                        <th scope='row'>Duration of Support</th>
                        <td>
                          <strong>
                            {indefiniteDuration
                              ? 'indefinite (unspecified) duration'
                              : `${spousalSupport?.minDuration} to ${spousalSupport?.maxDuration} years`}
                          </strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </React.Fragment>
        )}

        <div className='no-break reportBody'>
          <div className='bg-dark p-2 mb-3'>
            <h6 className='text-white mb-0'>
              <strong>Net Cash-Flow Analysis</strong>
            </h6>
          </div>

          <MonthlyBudgetTable
            spousalSupport={spousalSupport}
            clientName={clientFirstName}
            exName={exFirstName}
            showSpousalSupport={showSpousalSupport}
            agreedSpousalSupport={agreedSpousalSupport}
          />
        </div>

        <div className='reportBody'>
          <div className='bg-dark p-2 mb-2'>
            <h6 className='text-white mb-0'>
              <strong>Exceptions, Ceilings & Floors</strong>
            </h6>
          </div>

          {show && (
            <p>
              <em>N/A</em>
            </p>
          )}

          {showChildSupportResults && csPayorIncomeAboveCeiling && (
            <p>
              <strong>Child Support: </strong> {payorName}
              's income is above $150,000. The guideline child support amount may be inappropriate.
            </p>
          )}

          {showSpousalSupport && (
            <Fragment>
              {ssPayorIncomeAboveCeiling && (
                <p>
                  <strong>Spousal Support: </strong> {payorName}
                  's income is above $350,000. The guideline spousal support amount may be
                  inappropriate.
                </p>
              )}

              {ssPayorIncomeBelowFloor && (
                <React.Fragment>
                  <p>
                    <strong>Spousal Support: </strong>
                    {payorName}
                    's income is below the SSAG income floor of $20,000. The guideline spousal
                    support amount may be inappropriate.
                  </p>
                </React.Fragment>
              )}

              {ssPayorIncomeLowRange && (
                <React.Fragment>
                  <p>
                    <strong>Spousal Support: </strong>
                    {payorName}
                    's income is between $20,000 and $30,000. There is no presumption against
                    spousal support, but it may be necessary to depart from the lower end of the
                    formula ranges to account for the payor's ability to pay.
                  </p>
                </React.Fragment>
              )}

              {ssPayorIncomeLowRange && (
                <React.Fragment>
                  <p>
                    <strong>Spousal Support: </strong>
                    {payorName}
                    's income is between $20,000 and $30,000. There is no presumption against
                    spousal support, but it may be necessary to depart from the lower end of the
                    formula ranges to account for the payor's ability to pay.
                  </p>
                </React.Fragment>
              )}

              {ssChildDisability && (
                <React.Fragment>
                  <p>
                    <strong>Spousal Support: </strong>
                    Where the recipient is the caregiver for a child with a disability, it may be
                    necessary to extend the duration of support or increase the amount of support
                    above the upper range.
                  </p>
                </React.Fragment>
              )}

              {ssPayorDisability && (
                <React.Fragment>
                  <p>
                    <strong>Spousal Support: </strong>
                    {payorName}
                    's has a disability, which is a basis for a possible exception to the SSAGs. It
                    may be possible to accommodate this within the ranges, or it may be necessary to
                    extend the duration of support and reduce the amount of support, or otherwise
                    depart from the guidelines.
                  </p>
                </React.Fragment>
              )}

              {ssPayorNonTaxableIncome && (
                <React.Fragment>
                  <p>
                    <strong>Spousal Support: </strong>
                    {payorName}
                    's taxable income is less than the amount of support, such that {payorName} will
                    not be able to deduct some or all of the spousal support paid from income,
                    contrary to the assumption under the guidelines. This is a recognized basis for
                    an exception to the SSAGs, and departure from the guidelines may be necessary to
                    balance the tax positions and interests of the parties.
                  </p>
                </React.Fragment>
              )}

              {ssCustodialPayor && (
                <React.Fragment>
                  <p>
                    <strong>Spousal Support: </strong>
                    It may be necessary to depart from the guidelines where the non-custodial
                    recipient of spousal support has a significant parenting role, i.e. where the
                    relationship is of short duration and the child is young and the amount and
                    duration of support is insufficient to allow the non-custodial parent to fulfil
                    their parenting role.
                  </p>
                </React.Fragment>
              )}
            </Fragment>
          )}
        </div>

        <div className='reportBody'>
          <div className='bg-dark p-2 mb-3'>
            <h6 className='text-white mb-0'>
              <strong>Tax Profiles</strong>
            </h6>
          </div>
          <div className='row pl-3 pr-3'>
            <div className='col-6'>
              <TaxProfileTable
                party='client'
                supportCalculation={supportCalculation}
                supportProfile={clientSupportProfile}
                scenarios={scenarios}
                agreedSpousalSupport={agreedSpousalSupport}
                showSpousalSupport={showSpousalSupport}
              />
            </div>

            <div className='col-6'>
              <TaxProfileTable
                party='ex'
                supportCalculation={supportCalculation}
                supportProfile={exSupportProfile}
                scenarios={scenarios}
                agreedSpousalSupport={agreedSpousalSupport}
                showSpousalSupport={showSpousalSupport}
              />
            </div>
          </div>
          <p className='ml-4 mt-4'>
            <FontAwesomeIcon icon='edit' /> denotes amounts that have been manually added by the
            user
            <br />
            <FontAwesomeIcon icon='exclamation-triangle' /> denotes amounts where the default value
            been been overridden by the user
          </p>
        </div>

        <div className='no-break reportBody'>
          <div className='card'>
            <div className='card-body bg-secondary mt-0 pt-0 text-left'>
              <p className='mt-4 mb-0'>
                This report does not contain legal advice or establish a lawyer-client relationship.
                By using or referencing this report in any way, you agree to indemnify
                Divorcepath.com for any loss, damages, costs, or expenses incurred by you or any
                third parties in relation to this report, howsoever arising, regardless of theory of
                liability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </CondensedSupportReportStyle>
  );
};

export default CondensedSupportReportPage;
