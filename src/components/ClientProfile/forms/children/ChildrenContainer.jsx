import React, { useState, useEffect, useMemo, useCallback } from 'react';

import { useMutation } from '@apollo/client';
import { Form, FieldArray, connect } from 'formik';
import { FormGroup } from 'reactstrap';

import Button from 'components/common/Button';
import ToggleButtons from 'components/common/ToggleButtons';

import Children from 'components/ClientProfile/forms/children/Children';
import difference from 'components/calculations/utils/difference';
import { defaultChildren } from 'components/calculations/utils/defaultValues';

import UPDATE_CLIENT from 'graphql/mutations/clients/updateClient';

const ChildrenContainer = ({
  userId,
  handleSubmit,
  formType,
  title,
  secondTitle,
  description,
  formik,
  isRoleClient,
  loading,
}) => {
  const [isFirstSubmit, setFirstSubmit] = useState(true);
  const { setValues, values, errors = {}, setFieldValue, initialValues } = formik;

  const [updateClient, { loading: clientLoading }] = useMutation(UPDATE_CLIENT);

  const handleSubmitForm = useCallback(
    event => {
      event.preventDefault();

      setFirstSubmit(false);
      handleSubmit();
    },
    [handleSubmit],
  );

  const createChildren = useCallback(() => {
    const { children } = values;

    const { isHaveChildren, ...diff } = difference(values, initialValues) || {};

    const child = {
      ...defaultChildren,
      firstName: `Child ${children?.length ? children?.length + 1 : 1} `,
    };

    setFieldValue('children', [...(children || []), child]);

    const variables = {
      data: {
        ...diff,
        children: {
          create: {
            firstName: `Child ${(children?.length || 0) + 1}`,
            claimAsDependent: null,
            isDependent: true,
            parenting: 'SHARED',
            isOfRelationship: true,
          },
          update: children?.map((c, index) => ({
            where: { id: c?.id },
            data: { ...diff?.children?.[index] },
          })),
        },
      },
      where: {
        id: userId,
      },
    };

    updateClient({ variables });
  }, [updateClient, userId, values, initialValues, setFieldValue]);

  const removeChildren = useCallback(
    id => {
      const { children } = values;

      const { isHaveChildren, ...diff } = difference(values, initialValues) || {};

      const variables = {
        data: {
          children: {
            delete: {
              id,
            },
            update: children
              ?.filter(c => c?.id !== id)
              .map((c, index) => ({
                where: { id: c?.id },
                data: { ...diff?.children?.[index] },
              })),
          },
        },
        where: {
          id: userId,
        },
      };

      updateClient({ variables });
    },
    [updateClient, userId, initialValues, values],
  );

  const removeAllChildren = useCallback(() => {
    const variables = {
      data: {
        children: {
          deleteMany: {
            id: {
              in: values.children?.map(child => child.id),
            },
          },
        },
      },
      where: {
        id: userId,
      },
    };

    updateClient({ variables });
  }, [updateClient, userId, values.children]);

  useEffect(
    () => {
      const { isHaveChildren, children } = values;

      if (isHaveChildren && !children?.length) createChildren();
      if (!isHaveChildren && children?.length > 0) removeAllChildren();
      if (!isHaveChildren && !children?.length) {
        setValues({ isHaveChildren: false, children: null });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setValues, values.isHaveChildren],
  );

  const isHaveChildrenButtons = useMemo(
    () => [
      {
        value: false,
        label:
          formType === 'children'
            ? `No${isRoleClient ? ", I don't have" : ', my client has no'} children`
            : 'No other children',
        onClick: () => {
          setFieldValue('isHaveChildren', false);
          if (!values.children?.length) removeAllChildren();
        },
      },
      {
        value: true,
        label:
          formType === 'children'
            ? `Yes, ${isRoleClient ? 'I have' : 'my client has'} children`
            : `Yes, ${isRoleClient ? 'my' : "my client's"} ex has other children`,
      },
    ],
    [formType, isRoleClient, removeAllChildren, values, setFieldValue],
  );

  const parentingButtons = useMemo(
    () => [
      {
        value: 'CLIENT',
        label: isRoleClient ? 'You' : 'Client',
      },
      {
        value: 'SHARED',
        label: 'Shared',
      },
      {
        value: 'EX',
        label: 'Ex',
      },
    ],
    [isRoleClient],
  );

  return (
    <Form className='update-form-container' onSubmit={handleSubmitForm} name='form'>
      <FormGroup>
        {title && (
          <div className='page-inner-header mb-4'>
            <h5 className='mb-1'>{title}</h5>
            <p className='text-muted mb-0'>{description}</p>
          </div>
        )}
        <h5>{secondTitle}</h5>
        <ToggleButtons name='isHaveChildren' buttons={isHaveChildrenButtons} />
      </FormGroup>
      {values.isHaveChildren && (
        <FieldArray
          name='children'
          render={() => (
            <Children
              values={values}
              createChildren={createChildren}
              removeChildren={removeChildren}
              loading={loading || clientLoading}
              parentingButtons={parentingButtons}
            />
          )}
        />
      )}

      <Button
        type='submit'
        size='lg'
        leftFAIcon='check'
        className='mt-3'
        disabled={loading || clientLoading || (Object.keys(errors).length !== 0 && !isFirstSubmit)}
      >
        Save & Continue
      </Button>
    </Form>
  );
};

export default connect(ChildrenContainer);
