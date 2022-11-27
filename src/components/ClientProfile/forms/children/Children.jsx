import React, { useCallback } from 'react';

import { useFormikContext } from 'formik';
import dayjs from 'dayjs';
import { Row, Col, FormGroup } from 'reactstrap';

import DayPickerInput from 'components/common/inputs/DayPickerInput';
import TextInput from 'components/common/inputs/TextInput';
import Button from 'components/common/Button';
import ToggleButtons from 'components/common/ToggleButtons';

import {
  buttons,
  supportedByButtons,
  supportTypeButtons,
} from 'components/calculations/components/ChildrenForm/childrenMock';

import customGet from 'utils/get';

import { relationshipButtons, dependentButtons, genderButtons } from './childrenMock';

const Children = ({ removeChildren, createChildren, parentingButtons, loading }) => {
  const { setFieldValue, values } = useFormikContext();

  const handleFloatInput = useCallback(
    (e, name) => setFieldValue(name, parseFloat(e.target.value)),
    [setFieldValue],
  );

  if (!values?.children?.map) return null;

  return values?.children?.map((child, index) => (
    <div key={child?.id}>
      <Row>
        <Col md={6}>
          <h5>{`Child ${index + 1}`}</h5>
        </Col>
      </Row>
      <Row className='row'>
        <Col md={6}>
          <TextInput
            name={`children.${index}.firstName`}
            label='First name'
            hint={`Child ${index + 1}'s first name, as it appears on the birth certificate. No short
              forms or nicknames at the courthouse!`}
          />
        </Col>
        <Col md={6}>
          <TextInput
            name={`children.${index}.middleName`}
            label='Middle name(s)'
            hint={`Child ${index + 1}'s full middle name, if any. No initials, please.`}
          />
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <TextInput
            name={`children.${index}.lastName`}
            label='Last name(s)'
            hint={`Child ${index + 1}'s last name.`}
          />
        </Col>
        <Col md={6}>
          <ToggleButtons
            label='Gender'
            name={`children.${index}.gender`}
            buttons={genderButtons}
            hint={`Select the gender indicated on Child ${index + 1}'s birth certificate.`}
          />
        </Col>
      </Row>
      <Row className='align-items-center'>
        <Col md={6}>
          <FormGroup>
            <DayPickerInput
              name={`children.${index}.birthDate`}
              label='Date of Birth'
              hint={`Enter Child ${index + 1}'s date of birth.`}
              touchable
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup className='computed-date'>
            <label className='form-control-label'>Age</label>
            {child.birthDate ? (
              <p className='mt-3'>
                This child is
                <strong>{` ${dayjs().diff(child.birthDate, 'years')} years `}</strong>
                old.
              </p>
            ) : (
              <p className='mt-3'>Select a date of birth</p>
            )}
            <small className='form-text text-muted mt-1'>
              <span>Edit Child </span>
              {index + 1}
              &apos;s date of birth if this is wrong.
            </small>
          </FormGroup>
        </Col>
      </Row>
      <Row className='align-items-start'>
        <Col md={6}>
          <ToggleButtons
            label='Child of Relationship?'
            name={`children.${index}.isOfRelationship`}
            buttons={relationshipButtons}
            hintComponent={
              <small className='form-text text-muted mt-1'>
                {`Is Child ${index + 1} a child of this relationship? This can be
                complicated. If you're not sure how to answer, `}
                <a href='/'>read this.</a>
              </small>
            }
          />
        </Col>
        <Col md={6}>
          {child?.isOfRelationship ? (
            <ToggleButtons
              label='Parenting'
              name={`children.${index}.parenting`}
              buttons={parentingButtons}
              hint='Select the primary parent or shared parenting.'
            />
          ) : (
            <ToggleButtons
              label='Dependent Child?'
              name={`children.${index}.isDependent`}
              buttons={dependentButtons}
              hintComponent={
                <small className='form-text text-muted mt-1'>
                  {`Is Child ${index + 1} a legal dependent? This can be complicated if the
                child is over 18. If you're not sure, `}
                  <a href='/'>read this.</a>
                </small>
              }
            />
          )}
        </Col>
      </Row>
      {child?.isDependent && !child?.isOfRelationship && (
        <Row className='align-items-start'>
          <Col md={6}>
            <ToggleButtons
              label='Child of Prior Relationship?'
              name={`children.${index}.priorRelationship`}
              buttons={buttons}
              hint="Is the child from a prior relationship? If so, the calculator will apply the 'first family principle' and deduct child support for this child from guideline income for both spousal and child support."
            />
          </Col>
          <Col md={6}>
            <ToggleButtons
              label='Child is Supported By'
              name={`children.${index}.supportedBy`}
              buttons={supportedByButtons}
              hint='Which person has an obligation to support this child? Since this child is a legal dependent from another relationship, the cost of supporting the child will need to be calculated and deducted from their guideline income for this support calculation.'
            />
          </Col>
        </Row>
      )}
      {child?.isDependent && !child?.isOfRelationship && (
        <Row className='align-items-start'>
          <Col md={6}>
            <ToggleButtons
              label='Support Type'
              className='support-type-input'
              name={`children.${index}.supportType`}
              buttons={supportTypeButtons}
              hint="Select guideline support to automatically calculate and deduct guideline child support for this child from the parent's guideline income. Alternatively, you can deduct actual section 7 support paid or other support in a specified amount."
            />
          </Col>
          <Col md={6}>
            {child?.supportType === 'SPECIAL' || child?.supportType === 'OTHER' ? (
              <ToggleButtons
                label='Tax Deductible?'
                name={`children.${index}.supportDeductible`}
                buttons={buttons}
                hint='Is this support amount tax deductible? Usually it is not, however if the only support is section 7 expenses then they may be deductible. If support is not deductible, then the actual amount of support will be grossed-up and deducted from guideline income.'
              />
            ) : (
              <TextInput
                label="Child's Income"
                hint="*Note that the child's income is not relevant to the calculation of basic section 3 child support,
                  but is relevant to the calculation of certain tax credits and benefits that can affect section 7 special expense support."
                name={`children.${index}.childIncome`}
                placeholder={0}
                type='number'
                prepend='dollar'
                handleChange={e => handleFloatInput(e, `children.${index}.childIncome`)}
              />
            )}
          </Col>
        </Row>
      )}
      {child?.isDependent &&
        !child?.isOfRelationship &&
        (child?.supportType === 'SPECIAL' || child?.supportType === 'OTHER') && (
          <Row className='align-items-start'>
            <Col md={6}>
              <TextInput
                label='Support Amount'
                hint="*Note that the child's income is not relevant to the calculation of basic section 3 child support,
                        but is relevant to the calculation of certain tax credits and benefits that can affect section 7 special expense support."
                name={`children.${index}.supportAmount`}
                placeholder={0}
                type='number'
                prepend='dollar'
                handleChange={e => handleFloatInput(e, `children.${index}.supportAmount`)}
              />
            </Col>
            <Col md={6}>
              <TextInput
                label="Child's Income"
                hint="*Note that the child's income is not relevant to the calculation of basic section 3 child support,
                but is relevant to the calculation of certain tax credits and benefits that can affect section 7 special expense support."
                name={`children.${index}.childIncome`}
                placeholder={0}
                type='number'
                prepend='dollar'
                handleChange={e => handleFloatInput(e, `children.${index}.childIncome`)}
              />
            </Col>
          </Row>
        )}
      <Row className='align-items-start'>
        <Col md={6}>
          <ToggleButtons
            label='Child Has Disability'
            name={`children.${index}.disabled`}
            buttons={buttons}
            hint='Is the child eligible for the Disability Tax Credit or other recognized disability benefits?'
          />
        </Col>
        {child?.isOfRelationship && (
          <Col md={6}>
            <TextInput
              label="Child's Income"
              hint="*Note that the child's income is not relevant to the calculation of basic section 3 child support,
                but is relevant to the calculation of certain tax credits and benefits that can affect section 7 special expense support."
              name={`children.${index}.childIncome`}
              placeholder={0}
              type='number'
              prepend='dollar'
              handleChange={e => handleFloatInput(e, `children.${index}.childIncome`)}
            />
          </Col>
        )}
      </Row>
      <Row>
        <Col md={4} xs={6} className='mt-1'>
          <Button
            type='submit'
            size='lg'
            leftFAIcon='minus'
            className='mt-3'
            onClick={() => removeChildren(values.children?.[index]?.id)}
            disabled={loading}
          >
            Remove Child
          </Button>
        </Col>
        {(customGet(values, 'children', []).length === 0 ||
          customGet(values, 'children', []).length - 1 === index) && (
          <Col md={6} xs={6} className='mt-1 ml-md-3'>
            <Button
              type='submit'
              size='lg'
              leftFAIcon='plus'
              className='mt-3'
              onClick={createChildren}
              disabled={loading}
            >
              Add Child
            </Button>
          </Col>
        )}
      </Row>
      <hr />
    </div>
  ));
};

export default Children;
