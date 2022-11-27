/* eslint-disable no-shadow */
/* eslint-disable no-unused-expressions */
import React, { useMemo, useCallback, Fragment, useState } from 'react';

import { Formik, yupToFormErrors } from 'formik';
import { sortBy } from 'lodash';

import LocationPrompt from 'components/common/LocationPrompt';

import ChildrenContainer from 'components/ClientProfile/forms/children/ChildrenContainer';
import scrollToError from 'components/calculations/sidebar/scrollToError';

import { childrenSchema } from 'utils/schemas';
import customGet from 'utils/get';

const getChildrenVariables = (children, userId) => {
  if (children === null || children.length === 0)
    return {
      data: {
        hasChildren: false,
      },
      where: {
        id: userId,
      },
    };

  return {
    data: {
      children: {
        update: children?.map(({ __typename, ...child }) => ({
          where: {
            id: child.id,
          },
          data: {
            ...child,
          },
        })),
      },
    },
    where: {
      id: userId,
    },
  };
};

const ChildrenForm = ({ user, isRoleClient, updateUser }) => {
  const [loading, setLoading] = useState(false);

  const children = useMemo(() => customGet(user, 'client.children', []), [user]);

  const sortedChildren = useMemo(() => sortBy(children, o => new Date(o?.createdAt)), [children]);

  const initialValues = useMemo(
    () => ({
      isHaveChildren: sortedChildren?.length !== 0,
      children: sortedChildren.map(({ firstName, lastName, middleName, birthDate, ...props }) => ({
        firstName: firstName || '',
        lastName: lastName || '',
        middleName: middleName || '',
        birthDate: birthDate ? new Date(birthDate) : null,
        ...props,
      })),
    }),
    [sortedChildren],
  );

  const validateForm = useCallback(
    values =>
      childrenSchema
        .validate(values, { abortEarly: false, context: { isClient: isRoleClient } })
        .then(() => {})
        .catch(err => {
          setTimeout(() => scrollToError(), 0);
          return yupToFormErrors(err);
        }),
    [isRoleClient],
  );

  const handleSubmitForm = useCallback(
    ({ children }) => {
      const variables = getChildrenVariables(children, user?.client?.id);

      setLoading(true);

      updateUser(variables).finally(() => setLoading(false));
    },
    [updateUser, user],
  );

  return (
    <Formik
      validateOnBlur={false}
      enableReinitialize
      initialValues={initialValues}
      validate={validateForm}
      onSubmit={handleSubmitForm}
    >
      {({ handleSubmit, values }) => (
        <Fragment>
          <LocationPrompt initialValues={initialValues} values={values} />
          <ChildrenContainer
            userId={user?.client?.id}
            secondTitle={`${isRoleClient ? 'Do you' : 'Does your client'} have dependent children?`}
            formType='children'
            handleSubmit={handleSubmit}
            isRoleClient={isRoleClient}
            loading={loading}
          />
        </Fragment>
      )}
    </Formik>
  );
};

export default ChildrenForm;
