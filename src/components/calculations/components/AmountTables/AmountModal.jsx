/* eslint-disable max-len */
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { v4 as uuidv4 } from 'uuid';
import { Collapse, Row, Col } from 'reactstrap';
import { useFormikContext } from 'formik';
import numeral from 'numeral';
import { startCase, get, isObject, find, filter } from 'lodash';

import Select from 'components/common/inputs/Select/SelectField';
import UpgradeButton from 'components/common/UpgradeButton';
import { UPGRADE_PLAN_MODAL_NAME } from 'components/modals/upgrade/UpgradePlanModal';
import Button from 'components/common/Button';
import Icon from 'components/common/Icon';

import formatAmountKey from 'components/calculations/utils/formatAmountKey';
import difference from 'components/calculations/utils/difference';

import useCalculationContext from 'hooks/useCalculationContext';
import useModal from 'hooks/useModal';

import AmountInputForm from './AmountInputForm';

const inputsWithInitialUserInputs = [
  'climate_action_incentive',
  'northern_ontario_energy_credit',
  'carbon_price_rebate',
  'northern_residents',
  'ontario_energy_and_property_tax_credit_seniors',
  'ontario_energy_and_property_tax_credit',
  'other_payments_deduction',
];

const getUserInputs = (inputFields, floatData) => {
  if (!inputFields.length)
    return [
      {
        name: 'user_added',
        stringData: 'enabled',
        id: uuidv4(),
      },
    ];

  return inputFields.map(input => {
    const newInput = {
      name: input?.name || 'user_added',
      stringData: 'enabled',
    };

    if (!input.id) newInput.id = uuidv4();
    if (floatData && input?.name === 'base_credit') newInput.floatData = floatData;

    return newInput;
  });
};

const AmountModal = ({
  amount,
  fieldType,
  show,
  index,
  options,
  remove,
  partyType,
  toggleActiveRow,
  pathToAllAmount,
  pathToOtherAllAmount,
  otherAmounts,
  amountModalOtherOptions: otherOptions,
  setOpen,
}) => {
  const { values, setFieldValue, setFieldTouched } = useFormikContext();
  const { isSubscriptionActive, mutationLoading } = useCalculationContext();

  const [prevOtherAmount, setPrevOtherAmount] = useState(null);
  const { open } = useModal(UPGRADE_PLAN_MODAL_NAME);

  const allUserBenefits = useMemo(
    () => [
      ...get(values, `clientSupportProfile.federalBenefits.all`, []),
      ...get(values, `exSupportProfile.federalBenefits.all`, []),
    ],
    [values],
  );

  const hasUserBenefits = useMemo(
    () => isObject(allUserBenefits.find(benefit => benefit?.userInputs?.length > 0)),
    [allUserBenefits],
  );

  const hasUserInputsValues = useMemo(
    () =>
      fieldType.includes('Benefits')
        ? hasUserBenefits
        : (amount?.userInputs?.length || amount?.userInputs?.length) > 0,
    [amount, fieldType, hasUserBenefits],
  );

  // is the amount manually added by the user?
  const manualAmount = useMemo(() => amount?.status === 'USER_ADDED', [amount]);
  const editedAmount = useMemo(() => amount?.status === 'USER_EDITED', [amount]);

  const isChildInput = useMemo(() => {
    const notChildType = [
      'federalCredits',
      'provincialCredits',
      'federalDeductions',
      'provincialDeductions',
      'default_deduction',
      'default_credit',
      'basic_personal_amount',
      'eligible_dependant',
      'cpp_qpp',
      'ei_premiums',
      'canada_employment',
    ];

    return !notChildType.includes(fieldType) && !notChildType.includes(amount?.key);
  }, [fieldType, amount]);

  const hasDifference = useMemo(() => {
    if (!inputsWithInitialUserInputs.includes(amount?.key)) return false;
    if (!amount?.userInputs || !amount?.userInputs?.length || amount?.userInputs?.length)
      return false;

    const defaultInputs = amount?.defaultInputs?.map(d => ({
      floatData: d?.floatData || null,
      stringData: d?.stringData || null,
    }));

    const userInputs = amount?.userInputs?.map(d => ({
      floatData: d?.floatData || null,
      stringData: d?.stringData || null,
    }));

    return !!difference(defaultInputs, userInputs)?.length;
  }, [amount]);

  const hasUserChanges = useMemo(() => {
    if (isChildInput || amount?.key === 'climate_action_incentive') {
      const childrenValues = values.children || values.children;

      const claimAsDependent = childrenValues?.map(c => c?.claimAsDependent) || [];

      if (
        !claimAsDependent?.every(c => c === null) ||
        (inputsWithInitialUserInputs.includes(amount?.key) && hasDifference) ||
        amount.userInputs?.length
      ) {
        return true;
      }

      return false;
    }

    return editedAmount;
  }, [amount, editedAmount, values.children, hasDifference, isChildInput]);

  const icon = useMemo(() => {
    if (hasUserChanges) return <Icon name='triangle' className='mr-2' height='20' width='20' />;

    if (inputsWithInitialUserInputs.includes(amount?.key) && !hasDifference) return null;

    if (manualAmount) return <Icon name='edit' className='mr-2' />;

    return editedAmount && <Icon name='triangle' className='mr-2' height='20' width='20' />;
  }, [hasUserChanges, amount, hasDifference, manualAmount, editedAmount]);

  const formattedFieldType = fieldType.slice(0, -1);

  const newAmount = amount?.key.includes('default_');

  const selectOptions = useMemo(
    () =>
      options.map(({ key, label }) => ({
        value: key,
        label,
      })),
    [options],
  );

  const displayedValue = useMemo(() => {
    if (fieldType.includes('Deduction')) {
      if (['northern_residents', 'other_payments_deduction'].includes(amount?.key)) {
        if (amount?.userInputs?.length) {
          return numeral(amount.amount).format(' ($0,0)');
        }

        return numeral(amount.defaultAmount || 0).format(' ($0,0)');
      }
      return numeral(amount.userAmount || get(amount, `defaultInputs.0.floatData`)).format(
        ' ($0,0)',
      );
    }

    if (
      [
        'ontario_energy_and_property_tax_credit_seniors',
        'ontario_energy_and_property_tax_credit',
      ].includes(amount?.key)
    ) {
      return numeral(amount?.amount || amount?.defaultAmount || 0).format(' ($0,0)');
    }

    if (fieldType.includes('Credit')) {
      return numeral(
        (amount.userInputs && find(amount.userInputs, { name: 'base_credit' })?.floatData) ||
          (amount.defaultInputs &&
            find(amount?.defaultInputs, { name: 'base_credit' })?.floatData) ||
          get(amount, 'amount') ||
          amount.userInputs?.[0]?.floatData,
      ).format(' ($0,0)');
    }

    return numeral(amount?.userAmount || amount?.amount).format('($0,0');
  }, [fieldType, amount]);

  // > -1 when otherAmount has the linked amount
  const finalOtherIndex = otherAmounts.findIndex(o => o?.key === amount?.key);

  const finalPathPrefix = finalOtherIndex > -1 ? `${pathToOtherAllAmount}.${finalOtherIndex}` : '';

  const selectValue = useMemo(
    () => ({
      value: amount?.key,
      label: amount?.label,
    }),
    [amount],
  );

  const handleChangeSelect = useCallback(
    ({ value }) => {
      setFieldValue(`${pathToAllAmount}.${index}.key`, value);
      setFieldTouched(`${pathToAllAmount}.${index}.key`);

      toggleActiveRow(fieldType.concat(index));

      const otherOption = otherOptions.find(item => item.key === value);
      const otherAmount = otherAmounts.find(item => item.key === amount?.key);

      const currentFloatData = get(values, `${pathToAllAmount}.${index}`).userInputs?.find(
        input => input.name === 'base_credit' || input.name === 'user_added',
      )?.floatData;

      if (otherOption) {
        const otherInputFields = otherOptions.find(o => o.key === value)?.fields || [];
        const otherUserInputs = getUserInputs(otherInputFields, currentFloatData);

        if (otherAmount && !otherAmount.key?.includes('default')) {
          const newOtherAmounts = otherAmounts.map(amount => {
            if (prevOtherAmount?.id === amount?.id) {
              return { ...amount, key: value, userInputs: otherUserInputs };
            }

            return amount;
          });

          setFieldValue(pathToOtherAllAmount, newOtherAmounts);
        } else {
          const newOtherAmount = {
            id: uuidv4(),
            key: value,
            amount: 0,
            defaultAmount: 0,
            userInputs: otherUserInputs,
            status: 'USER_ADDED',
            prevOtherAmount: { ...amount, key: value },
          };

          setPrevOtherAmount(newOtherAmount);

          setFieldValue(pathToOtherAllAmount, [...otherAmounts, newOtherAmount]);
        }
      }

      if (prevOtherAmount && !otherOption) {
        setFieldValue(
          pathToOtherAllAmount,
          filter(otherAmounts, amount => amount?.id !== prevOtherAmount?.id),
        );
      }

      const inputFields = options.find(o => o.key === value)?.fields || [];
      const userInputs = getUserInputs(inputFields, currentFloatData);

      setFieldValue(`${pathToAllAmount}.${index}.userInputs`, userInputs);
    },
    [
      amount,
      fieldType,
      index,
      options,
      otherAmounts,
      otherOptions,
      pathToAllAmount,
      pathToOtherAllAmount,
      prevOtherAmount,
      setFieldTouched,
      setFieldValue,
      toggleActiveRow,
      values,
    ],
  );

  const amountLabel = useMemo(() => {
    if (newAmount) {
      if (fieldType.includes('Benefit')) {
        return 'New Benefit';
      }
      if (fieldType.includes('Credit')) {
        return 'New Credit';
      }

      return 'New Deduction';
    }

    return amount?.label;
  }, [amount.label, fieldType, newAmount]);

  const showUpgradeDesc = useMemo(
    () => !isSubscriptionActive && amount?.label,
    [amount, isSubscriptionActive],
  );

  const allSelectOptions = useMemo(() => {
    if (selectValue && selectValue.label) return [...selectOptions, selectValue];

    return selectOptions;
  }, [selectValue, selectOptions]);

  const handleClick = useCallback(() => {
    if (show) return toggleActiveRow(false);

    return toggleActiveRow(amount?.id || fieldType.concat(index));
  }, [amount, fieldType, index, show, toggleActiveRow]);

  const handleRemove = useCallback(() => {
    if (!isSubscriptionActive) return open();

    const currentKey = get(values, `${pathToAllAmount}.${index}.key`);

    setFieldTouched(pathToAllAmount);

    setFieldValue(
      pathToOtherAllAmount,
      filter(otherAmounts, amount => amount?.key !== currentKey),
    );

    remove();
  }, [
    index,
    isSubscriptionActive,
    open,
    otherAmounts,
    pathToAllAmount,
    pathToOtherAllAmount,
    remove,
    setFieldTouched,
    setFieldValue,
    values,
  ]);

  const entityName = useMemo(() => formatAmountKey(fieldType), [fieldType]);

  useEffect(() => {
    if (amount.prevOtherAmount && !prevOtherAmount) setPrevOtherAmount(amount.prevOtherAmount);
  }, [amount.prevOtherAmount, prevOtherAmount]);

  return (
    <div className='amount-table-row'>
      <Row noGutters className={`${show ? 'activerow' : 'amountrow'}`} onClick={handleClick}>
        <Col xs={3} sm={4}>
          {displayedValue}
        </Col>

        <Col xs={8} sm={7}>
          <div className='text-truncate'>
            {icon}
            {amountLabel}
          </div>
        </Col>
        <Col sm={1} className='col-1'>
          <span className='btn-inner--icon'>
            <Icon name={`arrow-${show ? 'up' : 'down'}`} />
          </span>
        </Col>
      </Row>

      <Collapse isOpen={show}>
        <Col sm={12} lg={{ size: 7, offset: 4 }} className='pl-0 pt-3 pb-3'>
          {manualAmount && (
            <div className='mb-3'>
              <span className='form-control-label'>{`${startCase(formattedFieldType)} Type`}</span>
              <Select
                disabled={mutationLoading}
                name={`${pathToAllAmount}.${index}.key`}
                options={allSelectOptions}
                defaultValue={selectValue.label ? selectValue : undefined}
                handleChange={handleChangeSelect}
              />
              <small className='form-text text-muted'>
                {`Select the ${startCase(formattedFieldType)} type. Each ${startCase(
                  formattedFieldType,
                )} can only be claimed once, so if you don't see it in the list of options it might already be claimed.`}
              </small>
            </div>
          )}

          {showUpgradeDesc && (
            <p className='pt-4 mb-0 d-flex flex-column align-items-start'>
              <span>
                <Icon name='info-circle' className='mr-2' height='20' width='20' />
                {`Upgrade to edit ${amount?.label}. `}
              </span>
              <UpgradeButton size='sm' className='d-inline-block my-2' />
            </p>
          )}

          <AmountInputForm
            setOpen={setOpen}
            amount={amount}
            index={index}
            partyType={partyType}
            fieldType={fieldType}
            pathToAmount={`${pathToAllAmount}.${index}`}
            otherAmountPath={finalPathPrefix}
            displayInfo={amount}
            hasUserInputsValues={hasUserInputsValues}
          />

          <div className='d-flex justify-content-between mt-4'>
            <Button color='red-link' size='sm' leftIcon='trash' onClick={handleRemove}>
              {`Delete ${entityName}`}
            </Button>
            <Button onClick={() => toggleActiveRow(false)} size='sm' color='link' leftIcon='cross'>
              {`Close ${formatAmountKey(fieldType)}`}
            </Button>
          </div>
        </Col>
      </Collapse>
    </div>
  );
};

export default AmountModal;
