/* eslint-disable no-console */

/* eslint-disable react/no-array-index-key */
import React, { useMemo } from 'react';

import { FieldArray, useFormikContext } from 'formik';
import { get } from 'lodash';
import numeral from 'numeral';
import { v4 as uuidv4 } from 'uuid';

import Button from 'components/common/Button';

import Income from 'components/calculations/components/Incomes/Income';
import Guidelines from 'components/calculations/components/Incomes/Guidelines';
import Hardships from 'components/calculations/components/Incomes/Hardships';
import { defaultIncome } from 'components/calculations/utils/defaultValues';

import customGet from 'utils/get';
import allTaxTables from 'utils/taxTables';

const IncomesList = ({ partyType, partyFirstName }) => {
  const { values, errors } = useFormikContext();

  const options = useMemo(
    () => ({
      incomes: allTaxTables[values.taxYear].income,
      hardships: allTaxTables[values.taxYear].hardship,
      adjustments: allTaxTables[values.taxYear].adjustments,
      childExpenses: allTaxTables[values.taxYear].child_expenses,
    }),
    [values.taxYear],
  );

  const pathToAllIncome = useMemo(() => `${partyType}.income.all`, [partyType]);

  const incomes = useMemo(() => customGet(values, pathToAllIncome, []), [pathToAllIncome, values]);

  const allIncomesError = useMemo(() => get(errors, pathToAllIncome), [errors, pathToAllIncome]);

  const totalIncome = useMemo(
    () =>
      values?.[partyType]?.income?.all?.reduce(
        (acc, item) => acc + parseInt(item?.userAmount || item?.amount || 0, 10),
        0,
      ),
    [values, partyType],
  );

  return (
    <div className='income-list-container'>
      <FieldArray name={pathToAllIncome}>
        {arrayHelpers => (
          <React.Fragment>
            {incomes?.map((income, index) => (
              <Income
                key={`income.${income?.id || index}`}
                index={index}
                amount={income}
                partyType={partyType}
                pathToAll={pathToAllIncome}
                options={options.incomes}
                fieldType='income'
                remove={() => arrayHelpers.remove(index)}
              />
            ))}
            <div className='pb-2'>
              {partyFirstName}
              &nbsp;Total Income:&nbsp;
              {numeral(totalIncome).format(' ($0,0')}* <br />
              <small>*Line 15000 on T1 Tax Return</small>
            </div>

            <Button
              size='md'
              color='link'
              onClick={() => arrayHelpers.push({ ...defaultIncome, id: uuidv4() })}
              leftIcon='plus'
            >
              Add Income
            </Button>

            {allIncomesError && (
              <span className='btn-inner--text invalid-feedback' style={{ color: 'red' }}>
                Required
              </span>
            )}
          </React.Fragment>
        )}
      </FieldArray>

      <Guidelines partyType={partyType} partyFirstName={partyFirstName} />

      <Hardships partyType={partyType} partyFirstName={partyFirstName} />
    </div>
  );
};

export default IncomesList;
