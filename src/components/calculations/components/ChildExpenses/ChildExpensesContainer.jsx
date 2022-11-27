/* eslint-disable no-console */
/* eslint-disable react/no-array-index-key */
import React, { useMemo } from 'react';

import { FieldArray, useFormikContext } from 'formik';
import numeral from 'numeral';
import { get } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import Button from 'components/common/Button';
import { UPGRADE_PLAN_MODAL_NAME } from 'components/modals/upgrade/UpgradePlanModal';

import ChildExpenses from 'components/calculations/components/ChildExpenses/ChildExpenses';
import { defaultChildExpense } from 'components/calculations/utils/defaultValues';

import useCalculationContext from 'hooks/useCalculationContext';
import useModal from 'hooks/useModal';

const childExpensesError = false;

const ChildExpensesContainer = () => {
  const { values, setFieldError } = useFormikContext();
  const { isSubscriptionActive } = useCalculationContext();
  const { open } = useModal(UPGRADE_PLAN_MODAL_NAME);

  const childExpenses = useMemo(() => get(values, 'childExpenses.all'), [values]);

  const totalExpensesAmount = useMemo(
    () => childExpenses?.reduce?.((acc, childExpense) => acc + (childExpense.userAmount || 0), 0),
    [childExpenses],
  );

  return (
    <FieldArray name='childExpenses.all'>
      {({ remove, push }) => (
        <div className='child-expenses-container'>
          {childExpenses?.map((expense, index) => (
            <ChildExpenses
              key={index}
              index={index}
              remove={() => remove(index)}
              expense={expense}
              pathToAllChildExpenses='childExpenses.all'
            />
          ))}

          <div className='mt-3'>
            <span>Total Expenses: </span>
            {numeral(totalExpensesAmount).format('($0,0')}
          </div>

          <Button
            size='md'
            color='link'
            className='mt-3'
            onClick={() => {
              push({ ...defaultChildExpense, id: uuidv4() });

              if (!isSubscriptionActive) open();

              setFieldError('childExpenses.all', false);
            }}
            leftIcon='plus'
          >
            Add Expense
          </Button>
          <div style={{ color: childExpensesError ? 'red' : 'black' }} className='small'>
            {childExpensesError}
          </div>
        </div>
      )}
    </FieldArray>
  );
};

export default ChildExpensesContainer;
