/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-expressions */
import React, { useCallback, useMemo, Fragment } from 'react';

import { useFormikContext } from 'formik';
import { get } from 'lodash';

import ChildrenToggle from 'components/calculations/components/AmountTables/InputForms/forms/ChildrenToggle';

import useCalculationContext from 'hooks/useCalculationContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ChildrenToggleList = ({ partyType }) => {
  const { values, setFieldValue, setFieldTouched } = useFormikContext();
  const { type, mutationLoading, isSubscriptionActive } = useCalculationContext();

  const clientName = useMemo(() => get(values, 'clientSupportProfile.firstName', ''), [values]);
  const exName = useMemo(() => get(values, 'exSupportProfile.firstName', ''), [values]);

  const children = useMemo(() => values.children, [values]);

  const handleReset = useCallback(() => {
    children?.forEach((child, index) => {
      if (type === 'update') {
        setFieldValue(`children.${index}.claimAsDependent`, null);
        setFieldTouched(`children.${index}.claimAsDependent`, true);
      } else {
        setFieldValue(`children.${index}.claimAsDependent`, null);
        setFieldTouched(`children.${index}.claimAsDependent`, true);
      }
    });
  }, [children, type, setFieldValue, setFieldTouched]);

  return (
    <Fragment>
      {(children || []).map((c, i) => (
        <ChildrenToggle
          child={c}
          key={i}
          partyType={partyType}
          childIndex={i}
          clientName={clientName}
          exName={exName}
        />
      ))}

      <small className='form-text text-muted pt-1'>
        By default, the benefit for each child is claimed by the person with primary parenting of
        that child. In shared parenting arrangments, both parties may claim the benefit.
      </small>

      <button
        type='button'
        disabled={mutationLoading || !isSubscriptionActive}
        className='btn btn-outline-primary btn-sm mt-3 mb-0 ml-10'
        onClick={handleReset}
      >
        <span className='btn-inner--icon mr-2'>
          <FontAwesomeIcon icon='undo' />
        </span>
        Reset
      </button>
    </Fragment>
  );
};

export default ChildrenToggleList;
