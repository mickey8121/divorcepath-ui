import React, { useMemo, Fragment, useCallback } from 'react';

import { FieldArray, useFormikContext } from 'formik';
import classnames from 'classnames';
import { v4 as uuidv4 } from 'uuid';

import Button from 'components/common/Button';

import ChildrenForm from 'components/calculations/components/ChildrenForm/ChildrenForm';
import { defaultChildren } from 'components/calculations/utils/defaultValues';

import useCalculationContext from 'hooks/useCalculationContext';

const ChildrenFormContainer = () => {
  const { values, errors, touched, isSubmitting } = useFormikContext();

  const { calculatorType } = useCalculationContext();

  const children = useMemo(() => values.children || [], [values]);
  const hasError = useMemo(() => errors.children || errors.children, [errors]);
  const isTouched = useMemo(() => touched.children || touched.children || false, [touched]);

  const error = useMemo(() => {
    if (calculatorType === 'CHILD' && !isTouched && hasError && !Array.isArray(hasError))
      return hasError;

    if (typeof hasError === 'string' && isTouched) return hasError;

    if (!!Object.keys(hasError || {}).length && !!Object.keys(isTouched || {}).length) {
      if (Array.isArray(hasError)) return null;

      return hasError;
    }

    return null;
  }, [hasError, isTouched, calculatorType]);

  const handleAddChild = useCallback(
    arrayHelpers => {
      const child = {
        ...defaultChildren,
        firstName: `Child ${children.length + 1} `,
        id: uuidv4(),
      };

      arrayHelpers.push(child);
    },
    [children],
  );

  return (
    <FieldArray name='children'>
      {arrayHelpers => (
        <Fragment>
          <div className='pt-2 my-3'>
            {children.map((child, index) => (
              <ChildrenForm
                key={child?.id || index}
                // child.data when type === update, child when type is create
                child={child}
                index={index}
                remove={() => arrayHelpers.remove(index)}
              />
            ))}

            <Button
              size='md'
              color='link'
              className={classnames('mt-3', { 'invalid-feedback-btn': !!error })}
              onClick={() => handleAddChild(arrayHelpers)}
              disabled={isSubmitting}
              leftIcon='plus'
            >
              Add Child
            </Button>

            <div
              className={classnames('invalid-feedback fade', {
                show: !!error && typeof error === 'string',
              })}
            >
              {typeof error === 'string' ? error : ''}
            </div>
          </div>
        </Fragment>
      )}
    </FieldArray>
  );
};

export default ChildrenFormContainer;
