import React, { Fragment, useMemo } from 'react';

import CardHeader from 'components/calculations/components/CardHeader';
import SpousalSupportRanges from 'components/calculations/SupportReport/components/SpousalSupportRanges';
import CalculationDetailsTable from 'components/calculations/SupportReport/components/CalculationDetailsTable';
import CustodialPayorTable from 'components/calculations/SupportReport/components/CustodialPayorTable';
import WithoutChildrenTable from 'components/calculations/SupportReport/components/WithoutChildrenTable';

import customGet from 'utils/get';

const rangeLabels = ['Spousal Support', 'Remaining Income'];

const Spousal = ({
  supportCalculation,
  spousalSupport,
  lowSpousalSupport,
  midSpousalSupport,
  highSpousalSupport,
  agreedSpousalSupport,
  agreedSpousalSupportScenario,
  showSpousalSupport,
  index,
}) => {
  const formula = useMemo(
    () => (showSpousalSupport ? customGet(spousalSupport, 'formula') : 'No Spousal'),
    [showSpousalSupport, spousalSupport],
  );
  const { clientSupportProfile, exSupportProfile } = useMemo(
    () => supportCalculation || {},
    [supportCalculation],
  );
  const npvDiscountRate =
    customGet(supportCalculation, 'npvDiscountRate') === 0
      ? 4
      : customGet(supportCalculation, 'npvDiscountRate');

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

  return (
    <Fragment>
      <div className='support-report-page'>
        <CardHeader
          text={`${index}. Spousal Support`}
          src='./img/icons/dusk/png/receive-cash.png'
          avatarContent='Amount & Duration'
          report
        />

        <div className='calculator-section'>
          <SpousalSupportRanges
            rangeLabels={rangeLabels}
            lowSpousalSupport={lowSpousalSupport}
            midSpousalSupport={midSpousalSupport}
            highSpousalSupport={highSpousalSupport}
            agreedSpousalSupport={agreedSpousalSupport}
            agreedSpousalSupportScenario={agreedSpousalSupportScenario}
            instant
          />

          <h6 className='mt-4'>Spousal Support Calculation Details</h6>

          <p>
            Calculation details for each of the low, mid and high spousal support scenarios are set
            out in the table below.
          </p>

          <CalculationDetailsTable
            spousalSupport={spousalSupport}
            clientName={clientSupportProfile?.firstName}
            exName={exSupportProfile?.firstName}
            showSpousalSupport={showSpousalSupport}
            agreedSpousalSupport={agreedSpousalSupport}
          />
        </div>
      </div>

      {['Custodial Payor', 'Without Children'].includes(formula) && (
        <section className='support-report-page'>
          <div className='reportBody'>
            {formula === 'Custodial Payor' && (
              <Fragment>
                <h6 className='mt-4'>Custodial Payor Adjustment</h6>

                <p>
                  Where the payor of spousal support is entitled to child support, the grossed-up
                  value of child support is used to determine the parties' adjusted incomes.
                </p>

                <CustodialPayorTable
                  spousalSupport={spousalSupport}
                  agreedSpousalSupport={agreedSpousalSupport}
                  clientName={clientSupportProfile?.firstName}
                  exName={exSupportProfile?.firstName}
                />
              </Fragment>
            )}

            {formula === 'Without Children' && (
              <Fragment>
                <h6 className='mt-4'>Formula Details</h6>

                <p>The support amount is calculated based on the difference in adjusted income.</p>

                <WithoutChildrenTable
                  className='col-12'
                  spousalSupport={spousalSupport}
                  agreedSpousalSupport={agreedSpousalSupport}
                />
              </Fragment>
            )}
          </div>
        </section>
      )}

      <section className='support-report-page'>
        <div className='reportBody'>
          <p className='font-italic'>
            <strong>*Lump Sum = net present value:</strong> The net present value of spousal
            support, i.e. lump sum support, is calculated based on an estimated duration of
            {npvDuration} months and applying a {npvDiscountRate}% discount rate to approximate
            future inflation. This lump sum calculation assumes the lump sum payment is
            non-deductible and non-taxable to the payor/recipient, respectively. Note that this
            calculation assumes support payments, tax rates and government benefits remain constant
            for the estimated duration of support.
          </p>
          <p>
            <strong>Spousal Support Ranges:</strong> The ranges for amount and duration are broad,
            especially where there is a large difference in income, or the relationship is of long
            duration. When determining the location within the ranges,{' '}
            <strong>the mid-point should not be treated as the default outcome!</strong> Factors
            including parenting, ability to pay, budgets and other factors should be considered. For
            a list of factors to consider in determining the location within the range, read our{' '}
            <a href='https://www.divorcepath.com/help'>guide</a>.
          </p>
          <hr />
          {formula === 'With Children' && (
            <p className='p-2'>
              <strong>The With Children Spousal Support Formula:</strong> Spousal support in range
              is calculated based on a percentage of individual net disposable income. Support
              payments in the low scenario will ensure the recipient a minimum of 29% of total
              disposable income, but may be higher. The high support scenario ensures the recipient
              receives a minimum of 40% of total net disposable income, and is capped at 50% of
              disposable income. The mid range scenario calculates support based on the percentage
              mid-range between the low and high scenarios. For more information, read our{' '}
              <a href='https://www.divorcepath.com/help'>guide</a>.
            </p>
          )}
          {formula === 'Without Children' && (
            <p className='p-2'>
              <strong>The Without Child Spousal Support Formula:</strong> The amount of support
              ranges from 1.5 to 2 percent of the difference between the spouses' gross incomes for
              each year of marriage (or cohabitation), up to a maximum of 50% of income difference.
              For more information, read our <a href='https://www.divorcepath.com/help'>guide</a>.
            </p>
          )}

          <h6 className='mt-4' id='spousalSupportDuration'>
            Spousal Support Duration
          </h6>

          <p>
            The time period for which spousal support is payable is calculated based on the duration
            of your relationship, your age, and the age of your children (if any).
          </p>

          <div className='d-flex align-items-center mt-4 mb-4 ml-4'>
            <span className='avatar'>
              <img
                alt='placeholder'
                src='./img/icons/dusk/png/relationship.png'
                className='img-saturate'
              />
            </span>
            <div className='avatar-content'>
              <h5 className='mb-0'>
                {indefiniteDuration
                  ? 'Indefinite Duration'
                  : `${spousalSupport?.minDuration} to ${spousalSupport?.maxDuration} years`}
              </h5>
              <small className='d-block text-muted'>support duration</small>
            </div>
          </div>

          <p>
            Minimum duration is the greater of (a) total years of cohabitation (capped at 25)
            multiplied by 0.5 or (b) the estimated number of years until youngest child starts full
            time school.
          </p>
          <p>
            Maximum duration is the greater of (a) total years of cohabitation (capped at 25)
            multipled by 1.0; or (b) the estimated number of years till youngest child finishes high
            school.
          </p>
          <p>
            The "Rule of 65" applies when the age of the recipient at separation plus the period of
            cohabitation exceed 65.
          </p>
          <p>
            Duration may be indefinite (not specified) where the "rule of 65" applies, or where the
            period of cohabitation exceeds 20 years, or at the court's discretion. Indefinite
            duration does not mean support continues forever. It means support payments are to be
            made for an unspecified period subject to future variation or review. The court may
            grant an indefinite initial order with a suggested minimum and maximum duration based on
            the ranges calculated above.
          </p>
          <p>Support duration calculation details are in the table below.</p>

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
                    <td>{spousalSupport?.twentyYearRelationship ? 'yes' : 'no'}</td>
                  </tr>
                  <tr>
                    <th scope='row'>Rule of 65</th>
                    <td>{spousalSupport?.ruleOf65 ? 'yes' : 'no'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <p>
            Spousal support is reviewable, meaning a court may adjust the amount payable at a later
            date if necessary due to changed circumstances. Spousal support orders are made for an
            indefinite or specified time period, subject to review.
          </p>

          <p>
            Note that re-marriage, changes to employment status and other factors can all affect
            ongoing entitlement to spousal support.
          </p>

          <p>
            <strong>Restructuring:</strong> The Spousal Support Advisory Guidelines explicitly
            recognize that support awards can be "restructured" by increasing or reducing the amount
            in consideration of extended or shortened duration of support payments. For
            restructuring options, read our <a href='https://www.divorcepath.com/help'>guide</a>.
          </p>

          <h6 className='mt-4'>&nbsp;</h6>
        </div>
      </section>
    </Fragment>
  );
};

export default Spousal;
