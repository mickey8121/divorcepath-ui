import React, { useState, useCallback, useMemo, Fragment, useEffect } from 'react';

import { useFormikContext } from 'formik';
import { Col, Row, Collapse } from 'reactstrap';

import Select from 'components/common/inputs/Select/SelectField';
import TextInput from 'components/common/inputs/TextInput';
import ToggleButtons from 'components/common/ToggleButtons';
import UpgradeButton from 'components/common/UpgradeButton';
import { UPGRADE_PLAN_MODAL_NAME } from 'components/modals/upgrade/UpgradePlanModal';
import Icon from 'components/common/Icon';

import useCalculationContext from 'hooks/useCalculationContext';
import useCurrentUser from 'hooks/useCurrentUser';
import useModal from 'hooks/useModal';

const pathToImage = `./img/icons/dusk/png/icons8-settings-64.png`;

const OptionsForm = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { isActiveSub } = useCurrentUser();
  const { open } = useModal(UPGRADE_PLAN_MODAL_NAME);

  const { setFieldValue, values } = useFormikContext();
  const { calculatorType, subscriptionType, isProfessional, type, personPronoun } =
    useCalculationContext();

  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  const isProUser = useMemo(
    () =>
      subscriptionType === 'SPOUSAL' || subscriptionType === 'PRO' || subscriptionType === 'FIRM',
    [subscriptionType],
  );

  const isCalculateSpousal = useMemo(
    () => isProfessional || calculatorType === 'SPOUSAL',
    [isProfessional, calculatorType],
  );

  const buttons = useCallback(
    (name, hasOnClick, isEmptyStartValue) => [
      {
        value: true,
        label: 'Yes',
        onClick: hasOnClick
          ? () => setFieldValue(name, isEmptyStartValue ? '' : 0) // 0 value will be used by API
          : undefined,
      },
      {
        value: false,
        label: 'No',
        onClick: hasOnClick
          ? () => setFieldValue(name, -1) // 0 value will be used by API
          : undefined,
      },
    ],
    [setFieldValue],
  );

  const year = useMemo(
    () =>
      ['2022', '2021', '2020', '2019', '2018', '2017']
        .map(value => ({
          label: value,
          value,
        }))
        .concat({
          label: 'More years coming soon...',
          value: null,
          isDisabled: true,
        }),
    [],
  );

  const childrenArray = values?.children || [];
  const childrenIsUnrelatedRelationship = childrenArray.every(
    c => c.data?.isOfRelationship === false || c?.isOfRelationship === false,
  );

  useEffect(() => {
    if (!values?.children) return;
    if (childrenIsUnrelatedRelationship) setFieldValue('showChildSupport', false);
    else setFieldValue('showChildSupport', true);
  }, [setFieldValue, values, type, childrenIsUnrelatedRelationship]);

  return (
    <Fragment>
      <Row id='options' noGutters className='border-top py-4 pl-2 cursor-pointer' onClick={toggle}>
        <Col sm={10} lg={5} className='col-10'>
          <div className='d-flex align-items-center'>
            <span className='avatar'>
              <img alt='placeholder' src={pathToImage} className='img-saturate' />
            </span>
            <div className='avatar-content'>
              <h5 className='mb-0 d-none d-lg-block'>Options</h5>
              <h6 className='mb-0 d-block d-lg-none'>Options</h6>
              <small className='d-block text-muted'>Calculation settings</small>
            </div>
          </div>
        </Col>
        <Col sm={2} lg={7} className='col-2 d-flex justify-content-end'>
          <div className='btn-icon-only text-center ml-lg-0'>
            <span className='btn-inner--icon'>
              <Icon name={`arrow-${isOpen ? 'up' : 'down'}`} />
            </span>
          </div>
        </Col>
      </Row>

      <Collapse className='px-1 offset-lg-5 col-lg-7 col-md-12' isOpen={isOpen}>
        {!isActiveSub && (
          <div className='mb-3 bg-light p-3'>
            <p className='mb-2'>
              Upgrade to customize your support calculation settings using the options below.
            </p>
            <UpgradeButton />
          </div>
        )}

        {!childrenIsUnrelatedRelationship && (
          <ToggleButtons
            label='Calculate Child Support?'
            name='showChildSupport'
            disabled={
              !isProUser || !isActiveSub || calculatorType === 'CHILD' || values?.showChildSupport
            }
            disabledOnClick={open}
            buttons={buttons()}
            hint='Select whether to calculate child support. Child support must be included in the calculation if there are dependent children of the relationship.'
          />
        )}

        <ToggleButtons
          label='Calculate Spousal Support?'
          name='showSpousalSupport'
          disabled={!isProUser || calculatorType === 'SPOUSAL'}
          disabledOnClick={open}
          buttons={buttons()}
          hint={
            isProUser
              ? 'Select whether to calculate spousal support. To calculate child support only, use the child support calculator.'
              : 'To calculate spousal support, use the spousal support calculator.'
          }
        />

        {!childrenIsUnrelatedRelationship && (
          <ToggleButtons
            label='Agreed Child Support?'
            name='agreedChildSupport'
            value={values?.agreedChildSupport >= 0}
            disabled
            disabledOnClick={open}
            buttons={buttons('agreedChildSupport', true)}
            hint='To enter agreed values for adult children, edit the type of child support paid in the extended options form for the individual child. Note that courts will require a reason to depart from the amount payable under the Child Support Guidelines. The calculator can compare this value to the amount payable under the Guidelines.'
          />
        )}

        {values?.agreedChildSupport >= 0 && (
          <TextInput
            min='0'
            disabled={!isActiveSub}
            disabledOnClick={open}
            name='agreedChildSupport'
            label='Agreed Child Support'
            hint='Enter the **monthly** agreed amount for child support, or 0 for no child support.'
            prepend='dollar'
            type='number'
          />
        )}

        {values?.showSpousalSupport && (
          <ToggleButtons
            label='Agreed Spousal Support?'
            name='agreedSpousalSupport'
            disabled={!isActiveSub}
            disabledOnClick={open}
            value={values?.agreedSpousalSupport >= 0}
            buttons={buttons('agreedSpousalSupport', true, true)}
            hint={`Answer "yes" to use agreed values for spousal support. The calculator can compare 
            ${personPronoun.your} 
            agreement to the amounts that would be payable under the Spousal Support Advisory Guidelines.`}
          />
        )}

        {values?.agreedSpousalSupport >= 0 && (
          <TextInput
            min='0'
            disabled={!isActiveSub}
            disabledOnClick={open}
            allowZero
            name='agreedSpousalSupport'
            label='Agreed Spousal Support'
            hint='Enter the **monthly** agreed amount for spousal support, or 0 for no spousal support.'
            prepend='dollar'
            type='number'
          />
        )}

        {isCalculateSpousal && values?.showSpousalSupport && (
          <TextInput
            min='0'
            append='percentage'
            disabled={!isActiveSub}
            disabledOnClick={open}
            name='npvDiscountRate'
            label='Lump Sum Discount Rate'
            hint='The percentage discount rate used to calculate the net present value (lump sum value) of support. Default is 4%, based on estimated long-term inflation and secure interest rate.'
            type='number'
            step='0.1'
          />
        )}

        {isCalculateSpousal && values?.showSpousalSupport && (
          <TextInput
            min='0'
            disabled={!isActiveSub}
            disabledOnClick={open}
            name='npvDuration'
            label='Lump Sum Duration'
            hint='Specify the duration, in months, to calculate the net present value (lump sum value) of support. If left blank, will default to mid-range duration.'
            type='number'
            allowZero
          />
        )}

        <Select label='Tax Year' name='taxYear' options={year} />

        <small className='form-text text-muted mt-1'>
          The tax year used to calculate child support (if applicable), taxes and benefits.
        </small>
      </Collapse>
    </Fragment>
  );
};

export default OptionsForm;
