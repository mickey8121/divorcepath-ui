/* eslint-disable no-console */

/* eslint-disable react/no-array-index-key */
import React, { useMemo, Fragment, useCallback, useState, useRef } from 'react';

import { v4 as uuidv4 } from 'uuid';
import { FieldArray, useFormikContext } from 'formik';
import { startCase, get } from 'lodash';
import classNames from 'classnames';

import Icon from 'components/common/Icon';

import AmountModal from './AmountModal';
import regionIcons from './regionIcons';

const AmountSubTable = ({
  fieldType,
  amountLabel,
  partyType,
  amounts,
  activeRow,
  toggleActiveRow,
  amountModalOptions,
  amountModalOtherOptions,
  otherFieldType,
  residence,
  formattedFieldType,
  supportCalculation,
}) => {
  const { values } = useFormikContext();

  const arrayHelpersRef = useRef(null);

  const [rowState, setRowState] = useState({ index: null, isOpen: false });

  const pathToAllAmount = useMemo(() => `${partyType}.${fieldType}.all`, [fieldType, partyType]);
  const pathToOtherAllAmount = useMemo(
    () => `${partyType}.${otherFieldType}.all`,
    [otherFieldType, partyType],
  );

  const otherAmounts = useMemo(
    () => get(values, pathToOtherAllAmount, []),
    [pathToOtherAllAmount, values],
  );

  const show = useCallback(
    (amount, index) => {
      const currentField = fieldType.concat(index);
      const isActive = activeRow === amount?.id || activeRow === currentField;

      const currentAmountType =
        !amount?.key?.includes('default_') &&
        amount?.key !== 'basic_personal_amount' &&
        (['eligible_dependant', 'cpp_qpp', 'ei_premiums', 'canada_employment'].includes(
          amount?.key,
        ) ||
          ['federalCredits', 'provincialCredits', 'federalDeductions'].includes(fieldType));

      const userAdded = ['update', 'create']
        .map(t => amount?.userInputs?.[t]?.map(input => input?.name))
        ?.flat()
        ?.includes('user_added');

      const isEmptyAmount =
        currentAmountType &&
        !amount?.userInputs?.filter(u => u)?.length &&
        [null, 0, NaN].includes(amount?.userAmount);

      return (
        amount?.key?.includes('default_') ||
        amount?.key?.includes('default_') ||
        (rowState?.isOpen && index === rowState?.index) ||
        isActive ||
        (isEmptyAmount && userAdded)
      );
    },
    [activeRow, rowState, fieldType],
  );

  const handleAddAmount = useCallback(() => {
    const newAmount = {
      key: `default_${formattedFieldType}`,
      id: uuidv4(),
      amount: 0,
      defaultAmount: 0,
      userInputs: [],
      status: 'USER_ADDED',
    };

    if (!amountModalOptions?.length || !amountModalOtherOptions?.length) return;

    arrayHelpersRef.current?.push(newAmount);
  }, [amountModalOptions, amountModalOtherOptions, formattedFieldType]);

  return (
    <Fragment>
      <div className='amount-table-header'>
        <img
          src={regionIcons[residence]}
          alt={`${residence} ${fieldType}`}
          className='avatar avatar-sm mr-3'
        />
        <strong>{`${residence} ${amountLabel}`}</strong>
      </div>

      <FieldArray name={pathToAllAmount}>
        {arrayHelpers => {
          arrayHelpersRef.current = arrayHelpers;

          return (
            <React.Fragment>
              {amounts?.length > 0 ? (
                amounts.map((amount, index) => (
                  <AmountModal
                    key={amount?.id || index}
                    index={index}
                    amount={amount}
                    pathToAllAmount={pathToAllAmount}
                    pathToOtherAllAmount={pathToOtherAllAmount}
                    show={show(amount, index)}
                    toggleActiveRow={toggleActiveRow}
                    fieldLabel={fieldType}
                    fieldType={fieldType}
                    amountLabel={amountLabel}
                    partyType={partyType}
                    // tableId={`${partyType}Federal${capitalize(fieldType)}`}
                    options={amountModalOptions}
                    otherAmounts={otherAmounts}
                    amountModalOtherOptions={amountModalOtherOptions}
                    setOpen={setRowState}
                    remove={() => arrayHelpers.remove(index)}
                  />
                ))
              ) : supportCalculation?.calculationResult ? (
                <div className='amount-table-row'>
                  <i>None</i>
                </div>
              ) : (
                <div className='amount-table-row'>
                  <i>Calculate support to view benefits, credits & deductions</i>
                </div>
              )}

              <div
                className={classNames('amount-table-row new-amount', {
                  disabled: !amountModalOptions?.length || !amountModalOtherOptions?.length,
                })}
                onClick={handleAddAmount}
              >
                <Icon name='plus' className='mr-2' />
                {`Add ${startCase(fieldType)} `}
              </div>
            </React.Fragment>
          );
        }}
      </FieldArray>
    </Fragment>
  );
};

export default AmountSubTable;
