import React, { useCallback, useMemo } from 'react';

import { useFormikContext } from 'formik';
import dayjs from 'dayjs';
import { capitalize, get, uniqueId } from 'lodash';
import { CustomInput, FormGroup } from 'reactstrap';

import useCalculationContext from 'hooks/useCalculationContext';

const ChildBenefit = ({ child, partyType, childIndex, clientName, exName }) => {
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const { supportCalculation } = useCalculationContext();

  const defaultClaimAsDependent = useMemo(
    () => get(supportCalculation, 'calculationResult.spousalSupport.claimAsDependentDefault'),
    [supportCalculation],
  );

  const age = useMemo(() => dayjs().diff(child.birthDate, 'years'), [child]);
  const gender = useMemo(() => (child?.gender === 'FEMALE' ? 'F' : 'M'), [child]);
  const parenting = useMemo(
    () =>
      child?.parenting === 'SHARED'
        ? 'Parenting is Shared'
        : `Primary Parent is ${capitalize(child?.parenting)}`,
    [child],
  );

  const pathToChild = useMemo(() => `children.${childIndex}.claimAsDependent`, [childIndex]);

  const claimValue = useMemo(
    () => child?.claimAsDependent || defaultClaimAsDependent?.[childIndex] || 'NONE',
    [child, defaultClaimAsDependent, childIndex],
  );

  const isClient = useMemo(() => partyType.includes('client'), [partyType]);
  const isEx = useMemo(() => partyType.includes('ex'), [partyType]);

  const handleChange = useCallback(
    e => {
      const value = e.target.checked;

      setFieldTouched(pathToChild, true);

      if (value) {
        if (isClient) {
          if (claimValue === 'EX') setFieldValue(pathToChild, 'SHARED');
          else setFieldValue(pathToChild, 'CLIENT');
        }

        if (isEx) {
          if (claimValue === 'CLIENT') setFieldValue(pathToChild, 'SHARED');
          else setFieldValue(pathToChild, 'EX');
        }
      } else {
        if (isClient) {
          if (claimValue === 'SHARED') setFieldValue(pathToChild, 'EX');
          else setFieldValue(pathToChild, 'NONE');
        }

        if (isEx) {
          if (claimValue === 'SHARED') setFieldValue(pathToChild, 'CLIENT');
          else setFieldValue(pathToChild, 'NONE');
        }
      }
    },
    [setFieldValue, claimValue, pathToChild, isClient, isEx, setFieldTouched],
  );

  const isChecked = useMemo(() => {
    if (partyType.includes('client')) return ['SHARED', 'CLIENT'].includes(claimValue);

    return ['SHARED', 'EX'].includes(claimValue);
  }, [partyType, claimValue]);

  const benefitsCaption = useMemo(() => {
    if (claimValue === 'SHARED') return 'Benefits are shared';
    if (claimValue === 'CLIENT') return `${clientName} claims benefits`;
    if (claimValue === 'EX') return `${exName} claims benefits`;

    return 'Neither party claims benefits';
  }, [claimValue, exName, clientName]);

  return (
    <div className='d-flex justify-content-between border-bottom mt-3'>
      <div className='col text-right text-xs-right mt-2 pl-0'>
        <FormGroup>
          <CustomInput
            id={uniqueId()}
            type='switch'
            name={partyType}
            checked={isChecked}
            label={
              <React.Fragment>
                {`${child?.firstName} ${child?.middleName || ''}`}
                <small className='d-block text-muted'>
                  {`Age ${age} / ${gender} / ${parenting} / ${benefitsCaption}`}
                </small>
              </React.Fragment>
            }
            onChange={handleChange}
          />
        </FormGroup>
      </div>
      <hr />
    </div>
  );
};

export default ChildBenefit;
