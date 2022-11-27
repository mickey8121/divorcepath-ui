import React, { useState, useEffect, useMemo, useCallback, Fragment } from 'react';

import { useFormikContext } from 'formik';
import dayjs from 'dayjs';
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import { Row, Col, Collapse } from 'reactstrap';
import { usePrevious } from 'react-delta';

import TextInput from 'components/common/inputs/TextInput';
import ToggleButtons from 'components/common/ToggleButtons';
import DayPickerInput from 'components/common/inputs/DayPickerInput';
import Select from 'components/common/inputs/Select/SelectField';
import Button from 'components/common/Button';
import Icon from 'components/common/Icon';

import regionNames from 'components/calculations/utils/regionNames';

import useCalculationContext from 'hooks/useCalculationContext';
import useCurrentUser from 'hooks/useCurrentUser';

import customGet from 'utils/get';
import { canadianProvinces, canadianTerritories } from 'utils/places';
import getDefaultAvatar from 'utils/getDefaultAvatar';

const optionsArray = sortBy(canadianProvinces.concat(canadianTerritories), 'name');
const genderButtons = [
  {
    value: 'FEMALE',
    label: 'Female',
  },
  {
    value: 'MALE',
    label: 'Male',
  },
];

const buttons = [
  {
    value: true,
    label: 'Yes',
  },
  {
    value: false,
    label: 'No',
  },
];

const PersonForm = ({ partyType }) => {
  const { type } = useCalculationContext();
  const { values, submitCount, errors, touched, setFieldValue } = useFormikContext();
  const { me } = useCurrentUser();

  // If we are on create calculation step it should be open by default
  const [isOpen, setIsOpen] = useState(type === 'create');
  const [moreOpen, setMoreOpen] = useState(false);

  const personFormErrors = customGet(errors, partyType, {});

  const personFormTouched = customGet(touched, partyType, {});

  const newPartner = useMemo(
    () => customGet(values, `${partyType}.hasNewPartner`),
    [partyType, values],
  );

  const clientResidence = useMemo(
    () => customGet(values, 'clientSupportProfile.residence'),
    [values],
  );
  const prevClientResidence = usePrevious(clientResidence);

  // delete errors.income;
  // delete touched.income;
  const hasValidationError =
    personFormErrors.birthDate ||
    personFormErrors.firstName ||
    personFormErrors.gender ||
    personFormErrors.hasNewPartner ||
    personFormErrors.residence ||
    personFormErrors.lastName;

  const hasFormTouched = isEmpty(personFormTouched) === false;

  useEffect(
    () => {
      if (isOpen === false && hasValidationError && hasFormTouched === true) {
        setIsOpen(true);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasValidationError, submitCount, hasFormTouched],
  );

  const sectionValues = useMemo(() => values?.[partyType], [values, partyType]);

  const name = useMemo(() => {
    if (!sectionValues?.firstName && !sectionValues?.lastName) return 'Enter name';

    return `${sectionValues?.firstName || ''} ${sectionValues?.lastName || ''}`;
  }, [sectionValues]);
  const gender = useMemo(() => sectionValues?.gender, [sectionValues]);
  const hasNewPartner = useMemo(() => sectionValues?.hasNewPartner, [sectionValues]);

  const personAge = useMemo(
    () => dayjs().diff(sectionValues?.birthDate, 'years') || 0,
    [sectionValues],
  );

  const residence = useMemo(() => sectionValues?.residence, [sectionValues]);
  const [defaultResidence] = useState(residence);

  const shortInfo = useMemo(
    () =>
      `Age ${personAge} / ${gender ? `${gender?.charAt(0)} /` : ''} ${
        sectionValues?.residence ? `${regionNames[sectionValues?.residence]} /` : ''
      } ${hasNewPartner ? 'R' : 'S'}`,
    [personAge, gender, hasNewPartner, sectionValues],
  );

  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  const toggleMore = useCallback(() => setMoreOpen(prev => !prev), []);

  const avatar = useMemo(() => getDefaultAvatar(gender), [gender]);

  const isDisabled = useMemo(
    () => ['Yukon', 'Northwest Territories', 'Nunavut'].includes(residence),
    [residence],
  );

  useEffect(() => {
    if (isDisabled && !sectionValues?.northernResident)
      setFieldValue(`${partyType}.northernResident`, true);
  }, [isDisabled, sectionValues, partyType, setFieldValue]);

  const handleChangePartnerIncome = useCallback(
    e => {
      e.target.value = e.target.value.replace(/^0+/, '');
      setFieldValue(`${partyType}.partnerIncome`, parseInt(e.target.value, 10));
    },
    [setFieldValue, partyType],
  );

  const handleChangePropertyCosts = useCallback(
    e => {
      e.target.value = e.target.value.replace(/^0+/, '');
      setFieldValue(`${partyType}.propertyCosts`, parseInt(e.target.value, 10));
    },
    [setFieldValue, partyType],
  );

  const handleChangeEnergyCosts = useCallback(
    e => {
      e.target.value = e.target.value.replace(/^0+/, '');
      setFieldValue(`${partyType}.energyCosts`, parseInt(e.target.value, 10));
    },
    [setFieldValue, partyType],
  );

  // If user changes residence for client, and ex is still default, change residence for ex to match client
  useEffect(() => {
    if (partyType === 'clientSupportProfile') {
      const exResidence = customGet(values, `exSupportProfile.residence`);

      if (
        clientResidence !== exResidence &&
        prevClientResidence !== clientResidence &&
        !me.client?.exAddress?.residence &&
        exResidence === defaultResidence
      ) {
        setFieldValue(`exSupportProfile.residence`, clientResidence);
      }
    }
  }, [
    values,
    partyType,
    setFieldValue,
    prevClientResidence,
    clientResidence,
    me,
    defaultResidence,
  ]);

  return (
    <Fragment>
      <Row
        noGutters
        className='border-top py-4 px-2 px-md-0 p-lg-4 cursor-pointer'
        onClick={toggle}
      >
        <Col sm={6} lg={5} className='col-10'>
          <div className='d-flex align-items-center'>
            <span className='avatar'>
              <img alt='placeholder' src={avatar} className='img-saturate' />
            </span>
            <div className='avatar-content'>
              <h5 className='mb-0'>{name}</h5>
              <small className='d-block text-muted'>{shortInfo}</small>
            </div>
          </div>
        </Col>

        <Col>
          <Row noGutters className='select-row'>
            <Select
              name={`${partyType}.residence`}
              defaultValue={residence}
              options={optionsArray}
              className='calculation-select'
            />

            <div className='angle-btn'>
              <Icon name={`arrow-${isOpen ? 'up' : 'down'}`} />
            </div>
          </Row>
        </Col>
      </Row>

      <Collapse className='px-1 offset-lg-5 col-lg-7 col-md-12' isOpen={isOpen}>
        <small className='d-none d-sm-block mt-sm-n4 mb-3 form-text text-muted'>
          The province or territory this person primarily resides in.
        </small>
        <div className='d-block d-sm-none mb-3'>
          <Select
            label='Residence'
            name={`${partyType}.residence`}
            defaultValue={residence}
            options={optionsArray}
            hint='*Required. The province or territory this person primarily resides in. Support varies by province.'
          />
        </div>

        <TextInput
          name={`${partyType}.firstName`}
          label='First name'
          hint='Used to customize your report'
        />

        <TextInput
          name={`${partyType}.lastName`}
          label='Last name'
          hint='Used to customize your report.'
        />

        <ToggleButtons
          label='Gender*'
          name={`${partyType}.gender`}
          buttons={genderButtons}
          hint='Used to customize your report.'
        />

        <DayPickerInput
          maxDate={new Date()}
          name={`${partyType}.birthDate`}
          label='Date of Birth'
          hint='Age is a factor in calculating tax and spousal support.'
          touchable
        />

        {residence === 'Ontario' && (
          <Fragment>
            <TextInput
              label='Annual Property Tax & Rent'
              hint="The person's total annual property tax, or total annual rent, or both (if applicable). Used to calculate the Ontario Trillium Benefit."
              name={`${partyType}.propertyCosts`}
              placeholder={0}
              type='number'
              prepend='dollar'
              handleChange={handleChangePropertyCosts}
            />
            <TextInput
              label='Annual Energy Costs'
              hint="The person's total annual energy costs. Used to calculate the Ontario Trillium Benefit."
              name={`${partyType}.energyCosts`}
              placeholder={0}
              type='number'
              prepend='dollar'
              handleChange={handleChangeEnergyCosts}
            />
          </Fragment>
        )}

        <Row noGutters className='p-1'>
          <Col
            onClick={toggleMore}
            xs={12}
            className='d-flex justify-content-between cursor-pointer'
          >
            <div className='d-block form-control-label pr-3'>
              {moreOpen ? ' - Hide' : '+ Show'} more options for {name}
              <br />
              <small className='text-muted'>
                (new partner, northern/rural resident, disability)
              </small>
            </div>
            <div className='btn-icon-only mr-0'>
              <div className='btn-icon-only float-right'>
                <Icon name={`arrow-${isOpen ? 'up' : 'down'}`} />
              </div>
            </div>
          </Col>
        </Row>

        <Collapse isOpen={moreOpen} className='mt-3'>
          <ToggleButtons
            label='New Partner?'
            name={`${partyType}.hasNewPartner`}
            buttons={buttons}
            hint='Remarried or new common law-partner? This can affect tax calculations.'
          />

          {newPartner === true && (
            <TextInput
              label="New Partner's Net Income*"
              hint='*Note that the net income of new partners is not used to calculate support directly,
              and is not normally expected to contribute to support, but is relevant to the
              calculation of certain tax credits and benefits.'
              name={`${partyType}.partnerIncome`}
              placeholder={0}
              type='number'
              prepend='dollar'
              handleChange={handleChangePartnerIncome}
            />
          )}

          <ToggleButtons
            label='Northern Resident'
            name={`${partyType}.northernResident`}
            buttons={buttons}
            disabled={isDisabled}
            hint='Eligible for Northern Residents tax deduction? This can affect tax calculations.'
          />

          <ToggleButtons
            label='Rural Resident'
            name={`${partyType}.ruralResident`}
            buttons={buttons}
            hint='Eligible for Climate Action Supplement for residents of rural and small communities?'
          />

          <ToggleButtons
            label='Person Has Disability'
            name={`${partyType}.disabled`}
            buttons={buttons}
            hint='Eligible for Disability Tax Credit and other disability-related benefits or credits?'
          />
        </Collapse>

        <Button size='sm' color='link' leftIcon='cross' className='mb-3'>
          Close
        </Button>
      </Collapse>
    </Fragment>
  );
};

export default PersonForm;
