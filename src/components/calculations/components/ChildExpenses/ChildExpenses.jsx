import React, { useState, useCallback, useMemo } from 'react';

import { useFormikContext } from 'formik';
import { Collapse, Row, Col } from 'reactstrap';
import { findIndex, get } from 'lodash';

import TextInput from 'components/common/inputs/TextInput';
import Button from 'components/common/Button';
import UpgradeButton from 'components/common/UpgradeButton';
import { UPGRADE_PLAN_MODAL_NAME } from 'components/modals/upgrade/UpgradePlanModal';
import CustomSelectContainer from 'components/common/inputs/Select/CustomSelectContainer';
import Icon from 'components/common/Icon';

import useCalculationContext from 'hooks/useCalculationContext';
import useModal from 'hooks/useModal';
import useCurrentUser from 'hooks/useCurrentUser';

import customGet from 'utils/get';
import allTaxTables from 'utils/taxTables';

const ChildExpenses = ({
  index,
  remove,
  expense,
  pathToAllChildExpenses,
  disabled,
  open = false,
}) => {
  const [ratio, setRatio] = useState(1.0);

  const formik = useFormikContext();
  const { type, isSubscriptionActive } = useCalculationContext();
  const { isPro } = useCurrentUser();
  const { open: openUpgradeModal } = useModal(UPGRADE_PLAN_MODAL_NAME);

  const clientTitle = useMemo(() => (isPro ? 'Client' : 'You'), [isPro]);

  const options = useMemo(
    () => ({
      incomes: allTaxTables[formik.values.taxYear].income,
      hardships: allTaxTables[formik.values.taxYear].hardship,
      adjustments: allTaxTables[formik.values.taxYear].adjustments,
      childExpenses: allTaxTables[formik.values.taxYear].child_expenses,
    }),
    [formik.values.taxYear],
  );

  const pathToChildExpense = useMemo(
    () => `${pathToAllChildExpenses}.${index}`,
    [index, pathToAllChildExpenses],
  );

  const pathToFloatData = useCallback(
    floatDataIndex => `${pathToChildExpense}.userInputs.${floatDataIndex}.floatData`,
    [pathToChildExpense],
  );

  const keyValue = useMemo(
    () => options.childExpenses.find(expenseOpt => expenseOpt.key === expense.key),
    [expense, options.childExpenses],
  );

  const selectValue = useMemo(() => ({ value: keyValue?.key, label: keyValue?.label }), [keyValue]);

  const isOpen = useMemo(() => {
    const value = customGet(formik.values, pathToChildExpense);

    return value?.userAmount === 0 && value?.key === 'other';
  }, [formik, pathToChildExpense]);

  const [show, toggleShow] = useState(open || isOpen);

  const selectOptions = useMemo(
    () =>
      options?.childExpenses?.map(({ key, label }) => ({
        value: key,
        name: label,
        isPremiumAvailable: isSubscriptionActive,
      })),
    [isSubscriptionActive, options],
  );

  const handleRemove = useCallback(() => remove(expense?.id), [expense, remove]);

  const handleFocus = useCallback(() => {
    toggleShow(true);
  }, []);

  const getUserInputIndex = useCallback(
    name => {
      if (type === 'create') {
        if (name === 'client') return 0;

        return 1;
      }

      let clientIndex = 0;

      if (get(formik.values, `${pathToAllChildExpenses}.${index}`)?.id) {
        const inputs = get(formik.values, pathToAllChildExpenses)?.[index]?.userInputs;

        clientIndex = findIndex(inputs, a => a?.name === name);
      }

      return clientIndex;
    },
    [formik, pathToAllChildExpenses, index, type],
  );

  const clientUserInput = useMemo(() => getUserInputIndex('client'), [getUserInputIndex]);
  const exUserInput = useMemo(() => getUserInputIndex('ex'), [getUserInputIndex]);

  return (
    <React.Fragment>
      <div className='children-form-row'>
        <h5>Expense {index + 1}</h5>
        <Row className='child-expense'>
          <Col sm={7} className='col-10'>
            <TextInput
              name={`${pathToChildExpense}.userAmount`}
              disabled={!isSubscriptionActive}
              disabledOnClick={openUpgradeModal}
              type='number'
              prepend='dollar'
              onFocus={handleFocus}
              handleChange={e => {
                // trim leading 0s
                e.target.value = e.target.value.replace(/^0+/, '');
                const userAmount = parseFloat(e.target.value) || 0;
                const roundedRatio = Math.round(ratio);

                formik.setFieldValue(`${pathToChildExpense}.userAmount`, userAmount);
                formik.setFieldTouched(`${pathToChildExpense}.userAmount`);

                formik.setFieldValue(
                  pathToFloatData(clientUserInput),
                  userAmount * roundedRatio || 0,
                );
                formik.setFieldValue(
                  pathToFloatData(exUserInput),
                  userAmount - userAmount * roundedRatio || 0,
                );
              }}
            />
          </Col>
          <Col className='col-2' sm={5}>
            <Row noGutters className='select-row'>
              <CustomSelectContainer
                name={`${pathToChildExpense}.key`}
                options={selectOptions}
                defaultValue={selectValue}
                onFocus={handleFocus}
                className='calculation-select'
              />

              <div onClick={() => toggleShow(!show)} className='px-4 py-2 angle-button'>
                <Icon name={`arrow-${show ? 'up' : 'down'}`} />
              </div>
            </Row>
          </Col>
        </Row>
      </div>

      <Collapse className='col-md-12 col-lg-10' isOpen={show}>
        <div className='mt-3 pb-3'>
          <div className='d-block d-sm-none mb-3'>
            <CustomSelectContainer
              className='d-sm-none'
              name={`${pathToChildExpense}.key`}
              options={selectOptions}
              defaultValue={selectValue}
            />
          </div>

          {!isSubscriptionActive && (
            <div className='upgrade-description bg-light p-3 mb-2'>
              <div className='d-flex justify-content-between'>
                <div className='form-text text-muted mr-2 mb-2'>
                  <Icon name='info-circle' className='mr-2' height='20' width='20' />
                  Special child-related expenses are a premium feature. Upgrade to calculate support
                  including special expenses.
                </div>
              </div>
              <UpgradeButton className='mt-2 mb-3' />
            </div>
          )}

          <div className='d-flex justify-content-between'>
            <div className='form-text text-muted mr-2 mb-2'>
              <Icon name='info-circle' className='mr-2' height='20' width='20' />
              {keyValue?.description}
            </div>
          </div>

          <Col xs={12} className='ml-0 mr-0 pl-0 pr-0'>
            <TextInput
              label={`Amount Paid by ${clientTitle}`}
              name={pathToFloatData(clientUserInput)}
              disabled={!isSubscriptionActive}
              disabledOnClick={openUpgradeModal}
              type='number'
              className='mb-0'
              prepend='dollar'
              hint={`Amount initially paid by ${clientTitle.toLowerCase()} (i.e. with receipt).`}
              handleChange={e => {
                // trim leading 0s
                e.target.value = e.target.value.replace(/^0+/, '');
                const clientAmount = parseFloat(e.target.value) || 0;
                const userAmount = customGet(formik, `values.${pathToChildExpense}.userAmount`, 0);
                const roundedRatio = Math.round(ratio);

                formik.setFieldTouched(`${pathToChildExpense}.userAmount`);
                formik.setFieldTouched(pathToFloatData(clientUserInput));
                formik.setFieldTouched(pathToFloatData(exUserInput));

                if (clientAmount === userAmount) {
                  formik.setFieldValue(`${pathToChildExpense}.userAmount`, clientAmount);

                  formik.setFieldValue(pathToFloatData(clientUserInput), clientAmount || 0);
                  formik.setFieldValue(pathToFloatData(exUserInput), 0);
                }

                if (clientAmount < userAmount) {
                  formik.setFieldValue(pathToFloatData(clientUserInput), clientAmount);
                  formik.setFieldValue(pathToFloatData(exUserInput), userAmount - clientAmount);

                  setRatio((clientAmount || 1) / (userAmount || 1));
                }

                if (userAmount === 0 || clientAmount > userAmount) {
                  formik.setFieldValue(`${pathToChildExpense}.userAmount`, clientAmount);

                  formik.setFieldValue(pathToFloatData(clientUserInput), clientAmount || 0);
                  formik.setFieldValue(
                    pathToFloatData(exUserInput),
                    clientAmount - clientAmount * roundedRatio || 0,
                  );
                }
              }}
            />
          </Col>

          <Col xs={12} className='ml-0 mr-0 pl-0 pr-0'>
            <TextInput
              label='Amount Paid by Ex'
              name={pathToFloatData(exUserInput)}
              disabled={!isSubscriptionActive}
              disabledOnClick={openUpgradeModal}
              type='number'
              className='mb-0'
              prepend='dollar'
              hint='Amount initially paid by ex (i.e. with receipt).'
              handleChange={e => {
                // trim leading 0s
                e.target.value = e.target.value.replace(/^0+/, '');
                const exAmount = parseFloat(e.target.value) || 0;
                const userAmount = customGet(formik, `values.${pathToChildExpense}.userAmount`, 0);
                const roundedRatio = Math.round(ratio);

                formik.setFieldTouched(`${pathToChildExpense}.userAmount`);
                formik.setFieldTouched(pathToFloatData(exUserInput));
                formik.setFieldTouched(pathToFloatData(clientUserInput));

                if (exAmount === userAmount) {
                  formik.setFieldValue(`${pathToChildExpense}.userAmount`, exAmount);
                  formik.setFieldValue(pathToFloatData(clientUserInput), 0);
                  formik.setFieldValue(pathToFloatData(exUserInput), exAmount || 0);
                }

                if (exAmount < userAmount) {
                  formik.setFieldValue(pathToFloatData(exUserInput), exAmount);
                  formik.setFieldValue(pathToFloatData(clientUserInput), userAmount - exAmount);

                  setRatio((userAmount - exAmount) / userAmount);
                }

                if (userAmount === 0 || exAmount > userAmount) {
                  formik.setFieldValue(`${pathToChildExpense}.userAmount`, exAmount);

                  formik.setFieldValue(
                    pathToFloatData(clientUserInput),
                    exAmount - exAmount * roundedRatio || 0,
                  );
                  formik.setFieldValue(pathToFloatData(exUserInput), exAmount || 0);
                }
              }}
            />
          </Col>

          <div className='d-flex justify-content-between'>
            <div className='form-text text-muted mb-2'>
              <Icon name='info-circle' className='mr-2' height='20' width='20' />
              Typically one parent will pay the entire amount up front. Read about special expenses
              to learn more.
            </div>
          </div>

          <div className='d-flex justify-content-between'>
            <Button
              size='sm'
              disabled={disabled}
              color='red-link'
              onClick={handleRemove}
              leftIcon='trash'
            >
              Delete
            </Button>
          </div>
        </div>
      </Collapse>
    </React.Fragment>
  );
};

export default ChildExpenses;
