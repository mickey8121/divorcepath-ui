/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { Fragment, useMemo } from 'react';

import numeral from 'numeral';
import classnames from 'classnames';

import customGet from 'utils/get';

const format = (obj, path) => numeral(customGet(obj, path, 0) / 12.0).format('($0,0');
const round = (obj, path) => numeral(Math.abs(Math.round(customGet(obj, path, 0)))).format('($0,0');

const Formulas = ({
  clientFirstName,
  exFirstName,
  childSupport,
  spousalSupport,
  agreedSpousalSupport,
  scenarios,
  showSpousalSupport,
}) => {
  const formula = showSpousalSupport ? customGet(spousalSupport, 'formula') : 'No Spousal';

  const firstScenario = agreedSpousalSupport ? scenarios[4] : scenarios[0];
  const secondScenario = agreedSpousalSupport ? scenarios[0] : scenarios[1];
  const thirdScenario = scenarios[2];

  const custodialRows = useMemo(
    () => [
      {
        name: 'Guideline Income',
        client: format(childSupport, 'client.guidelineIncome'),
        ex: format(childSupport, 'ex.guidelineIncome'),
      },
      {
        name: 'Child Support (Notional or Table)',
        client: format(spousalSupport, 'clientCustodialPayorCS'),
        ex: format(spousalSupport, 'exCustodialPayorCS'),
      },
      {
        name: 'Gross-Up of Child Support',
        client: format(spousalSupport, 'clientCustodialPayorCSGrossUp'),
        ex: format(spousalSupport, 'exCustodialPayorCSGrossUp'),
      },
      {
        name: 'Adjusted Guideline Income',
        client: format(spousalSupport, 'clientAdjustedGuidelineIncome'),
        ex: format(spousalSupport, 'exAdjustedGuidelineIncome'),
      },
    ],
    [childSupport, spousalSupport],
  );

  const formulasRow = useMemo(
    () => [
      {
        label: 'SSAG Spousal Scenario',
        low: agreedSpousalSupport ? 'Agreed' : 'Low',
        mid: agreedSpousalSupport ? 'Low' : 'Mid',
        high: 'High',
        isAlternate: true,
      },
      {
        label: 'Percent/Year of Marriage',
        low: '1.5%',
        mid: '1.75%',
        high: '2%',
      },
      {
        label: 'Years of Marriage/Cohabitation',
        low: spousalSupport?.durationOfRelationship,
        mid: spousalSupport?.durationOfRelationship,
        high: spousalSupport?.durationOfRelationship,
        isAlternate: true,
      },
      {
        label: 'Percent of Gross Income Differential',
        low: numeral(customGet(firstScenario, 'percent', 0)).format('0.00%'),
        mid: numeral(customGet(secondScenario, 'percent', 0)).format('0.00%'),
        high: numeral(customGet(thirdScenario, 'percent', 0)).format('0.00%'),
      },
      {
        label: 'Gross Income Differential (monthly)',
        low: format(spousalSupport, 'incomeDifferential'),
        mid: format(spousalSupport, 'incomeDifferential'),
        high: format(spousalSupport, 'incomeDifferential'),
        isAlternate: true,
      },
      {
        label: 'Spousal Support (monthly)',
        low: round(firstScenario, `clientSpousalSupport.monthlySpousalSupport`),
        mid: round(secondScenario, `clientSpousalSupport.monthlySpousalSupport`),
        high: round(thirdScenario, `clientSpousalSupport.monthlySpousalSupport`),
      },
    ],
    [agreedSpousalSupport, firstScenario, secondScenario, thirdScenario, spousalSupport],
  );

  return (
    <Fragment>
      {formula === 'Custodial Payor' && (
        <React.Fragment>
          <div className='col-8'>
            <div className='details-row-title'>Custodial Payor Spousal Support Calculation</div>
            <table className='table table-striped'>
              <thead>
                <tr>
                  <th scope='col' />
                  <th scope='col'>{clientFirstName}</th>
                  <th scope='col'>{exFirstName}</th>
                </tr>
              </thead>
              <tbody>
                {custodialRows.map(({ name, client, ex }) => (
                  <tr key={name}>
                    <th scope='row'>{name}</th>
                    <td>{client}</td>
                    <td>{ex}</td>
                  </tr>
                ))}
                <tr>
                  <th scope='row'>Gross Income Differential</th>
                  <td colSpan='2'>
                    {numeral(customGet(spousalSupport, 'incomeDifferential', 0) / 12.0).format(
                      '($0,0',
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className='p-2'>
            <strong>The Custodial Payor Spousal Support Formula:</strong> Where the party paying
            spousal support is also the primary parent and net recipient of child support, spousal
            support is calculated based on the difference between the parties' incomes after
            grossing-up notional child support (for the spousal support payor) and grossing-up net
            child support paid (for the child support payor). Support is then calculated based on
            the duration of the relationship and the income differential between the parties.
          </p>
        </React.Fragment>
      )}

      {['Custodial Payor', 'Without Children'].includes(formula) && (
        <table className='table table-striped'>
          <tbody>
            {formulasRow.map(({ label, low, mid, high, isAlternate }) => (
              <tr key={label} className={classnames({ 'alternate-row': isAlternate })}>
                <th scope='row'>{label}</th>
                <td>{low}</td>
                <td className='table-middle'>{mid}</td>
                <td>{high} </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Fragment>
  );
};

export default Formulas;
