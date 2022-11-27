/* eslint-disable react/no-danger */
import React, { useCallback } from 'react';

import toRoundUSD from 'utils/toRoundUSD';
import customGet from 'utils/get';
import toUSD from 'utils/toUSD';

const Conclusion = ({ showSpousalSupport, scenarios, payorName, payor, payee, payeeName }) => {
  const Scenario = useCallback(
    ({ scenario }) => {
      const condition =
        customGet(scenario, `${payor}.childExpenses.support`) >
        customGet(scenario, `${payee}.childExpenses.support`);

      const payorPercent = (
        customGet(scenario, `${payor}.childExpenses.percentShare`) * 100
      ).toFixed(1);
      const payeePercent = (
        customGet(scenario, `${payee}.childExpenses.percentShare`) * 100
      ).toFixed(1);

      const content = `
        In the <b>${scenario?.name}</b> scenario, adjusting for spousal support, ${payorName} has 
        <b>${payorPercent}%</b> of net income and ${payeeName} has 
        <b>${payeePercent}%</b> net income. Each person should pay that percentage of total special expenses, 
        after deducting any tax savings or benefits received in relation to the expense. On that basis,
        ${payorName} should pay net expenses of
        <b>${toUSD(customGet(scenario, `${payor}.childExpenses.share`))}</b>
        and ${payeeName} should pay net expenses of 
        <b>${toUSD(customGet(scenario, `${payee}.childExpenses.share`))}</b>. 
        Taking into consideration which party paid 
        each expense up front, ${condition ? payorName : payeeName} would 
        pay ${condition ? payeeName : payorName} section 7 support in the amount of
        <b>${toUSD(customGet(scenario, `${payor}.childExpenses.support`))}</b> to account for his or
        her share of expenses.
      `;

      return <li className='mb-2' dangerouslySetInnerHTML={{ __html: content }} />;
    },
    [payee, payor, payeeName, payorName],
  );

  const SpousalSupport = useCallback(() => {
    if (showSpousalSupport)
      return (
        <ul>
          {scenarios.map(scenario => (
            <Scenario scenario={scenario} key={scenario.id} />
          ))}
        </ul>
      );

    const payorPercent = (
      customGet(scenarios?.[3], `${payor}.childExpenses.percentShare`) * 100
    ).toFixed(1);
    const payeePercent = (
      customGet(scenarios?.[3], `${payee}.childExpenses.percentShare`) * 100
    ).toFixed(1);

    const content = `
        ${payorName} has
        <b>${payorPercent}%</b>
        of net income and ${payeeName} has
        <b>${payeePercent}%</b> of net income. Each person should pay that percentage of total
        special expenses, after deducting any tax savings or benefits received in relation to the
        expense. On that basis, ${payorName} should pay net expenses of
        <b>${toUSD(customGet(scenarios?.[3], `${payor}.childExpenses.share`))}</b>
        and ${payeeName} should pay net expenses of
        <b>${toUSD(customGet(scenarios?.[3], `${payee}.childExpenses.share`))}</b>. Taking into
        consideration which party paid each expense up front, ${payorName} would pay ${payeeName} 
        section 7 support in the amount of
        <b>${toRoundUSD(customGet(scenarios?.[3], `${payee}.childExpenses.support`))}</b> to
        account for his or her share of expenses.
      `;

    return <p dangerouslySetInnerHTML={{ __html: content }} />;
  }, [payee, payeeName, payor, payorName, scenarios, showSpousalSupport]);

  return (
    <div className='support-report-page'>
      <div className='calculator-section'>
        <h6>Special Expense Support Conclusion</h6>

        <p>
          Special expenses are to be shared between the parties based on their proportionate
          incomes, as described below.
        </p>

        <SpousalSupport />

        <p>
          The above apportionment calculations are based on the guideline income and actual expense
          payments shown in the calculation details table on the previous page.
        </p>

        <h6>Special Expense Support Explanation</h6>

        <p>
          Section 7(1) of the Federal Child Support Guidelines defines "special and/or extraordinary
          expenses" that are not included in basic section 3 child support. These expenses may
          include (but are not limited to):
        </p>

        <ol type='a'>
          <li>
            child care expenses incurred as a result of the custodial parent's employment, illness,
            disability or education or training for employment;
          </li>
          <li>
            that portion of the medical and dental insurance premiums attributable to the child;
          </li>
          <li>
            health-related expenses that exceed insurance reimbursement by at least $100 annually,
            including orthodontic treatment, professional counselling provided by a psychologist,
            social worker, psychiatrist or any other person, physiotherapy, occupational therapy,
            speech therapy and prescription drugs, hearing aids, glasses and contact lenses;
          </li>
          <li>
            extraordinary expenses for primary or secondary school education or for any other
            educational programs that meet the child's particular needs;
          </li>
          <li>expenses for post-secondary education; and</li>
          <li>extraordinary expenses for extracurricular activities.</li>
        </ol>

        <p>
          Review section 7 of the Guidelines for additional clarifications regarding qualifying
          expenses.
        </p>

        <p>
          Under section 7(2) of the Federal Child Support Guidelines, these expenses are shared by
          both parents in proportion to their incomes. The cost that is shared is the net cost of
          the expense, after accounting for any tax credits or benefits received in relation to the
          expense.
        </p>

        <p>
          The income used to calculate each party's proportionate share of the expense is income net
          any spousal support actually paid. That is, the payor deducts spousal support payments
          from their income, and the recipient adds spousal support payments to their income.
        </p>

        <p>
          <strong>
            <em>
              It is crucial that special expenses be apportioned based on the actual amount of
              spousal support paid, otherwise one party will end up paying more than their share of
              the expense.
            </em>
          </strong>
        </p>
      </div>
    </div>
  );
};

export default Conclusion;
