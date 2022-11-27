/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useMemo } from 'react';

import numeral from 'numeral';

import customGet from 'utils/get';

const format = (obj, path) => numeral(customGet(obj, path, 0)).format('($0,0');

const ChildS3 = ({ clientFirstName, exFirstName, childSupport }) => {
  const otherChildSupport = useMemo(
    () => !!customGet(childSupport, 'clientChildSupport.otherMonthlySupport'),
    [childSupport],
  );

  const otherChildSupportRow = useMemo(
    () =>
      otherChildSupport
        ? [
            {
              clientValue: format(childSupport, 'clientChildSupport.otherMonthlySupport'),
              exValue: format(childSupport, 'exChildSupport.otherMonthlySupport'),
              name: 'Other Child Support (Monthly)',
            },
          ]
        : [],
    [childSupport, otherChildSupport],
  );

  const rows = useMemo(
    () => [
      {
        name: 'Employment Income',
        clientValue: format(childSupport, 'clientChildSupport.employmentIncome'),
        exValue: format(childSupport, 'exChildSupport.employmentIncome'),
      },
      {
        name: 'Line 15000 Income',
        clientValue: format(childSupport, 'clientChildSupport.income.total'),
        exValue: format(childSupport, 'exChildSupport.income.total'),
      },
      {
        name: 'CS Guideline Income',
        clientValue: format(childSupport, 'clientChildSupport.guidelineIncome'),
        exValue: format(childSupport, 'exChildSupport.guidelineIncome'),
      },
      {
        name: `Eligible Children ${otherChildSupport ? '(guideline)' : ''}`,
        clientValue: customGet(childSupport, 'clientChildSupport.tableChildren', 0),
        exValue: customGet(childSupport, 'exChildSupport.tableChildren', 0),
      },
      {
        name: 'Table Child Support (Monthly)',
        clientValue: format(childSupport, 'clientChildSupport.tableMonthlySupport'),
        exValue: format(childSupport, 'exChildSupport.tableMonthlySupport'),
      },
      ...otherChildSupportRow,
      {
        name: 'Net Child Support (Monthly)',
        clientValue: format(childSupport, 'clientChildSupport.netMonthlySupport'),
        exValue: format(childSupport, 'exChildSupport.netMonthlySupport'),
      },
    ],
    [childSupport, otherChildSupport, otherChildSupportRow],
  );

  return (
    <div className='no-break reportBody'>
      <div className='bg-dark p-2 mb-3'>
        <h6 className='text-white mb-0'>
          <strong>Child Support (s. 3 CSG) Calculation Details</strong>
        </h6>
      </div>
      <div className='row'>
        <div className='col-8'>
          <table className='table table-striped'>
            <thead>
              <tr>
                <th scope='col' />
                <th scope='col'>{clientFirstName}</th>
                <th scope='col'>{exFirstName}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ name, exValue, clientValue }) => (
                <tr key={name}>
                  <th scope='row'>{name}</th>
                  <td>{clientValue}</td>
                  <td>{exValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ChildS3;
