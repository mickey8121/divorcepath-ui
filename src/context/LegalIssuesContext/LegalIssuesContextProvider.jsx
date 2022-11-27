import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useFormikContext } from 'formik';
import { usePrevious } from 'react-delta';
import sortBy from 'lodash/sortBy';
import differenceBy from 'lodash/differenceBy';

import useCurrentUser from 'hooks/useCurrentUser';
import useCreateLegalIssue from 'hooks/issues/useCreateLegalIssue';
import useUpdateLegalIssue from 'hooks/issues/useUpdateLegalIssue';
import useDeleteLegalIssue from 'hooks/issues/useDeleteLegalIssue';
import useConfirm from 'hooks/useConfirm';

import LegalIssuesContext from 'context/LegalIssuesContext/LegalIssuesContext';

const LEGAL_ISSUE_FIELD = 'legalIssue';

const createOptionsArray = issues =>
  issues?.map(({ name, description, id }) => ({
    value: id,
    label: name,
    description,
    fromServer: true,
  })) || [];

const LegalIssuesContextProvider = ({ children }) => {
  const { setFieldValue, values } = useFormikContext();
  const { me } = useCurrentUser();
  const { handleCreate, loading } = useCreateLegalIssue();
  const handleUpdate = useUpdateLegalIssue();
  const handleDelete = useDeleteLegalIssue();

  const [isOptionUpdated, setIsOptionUpdated] = useState(false);
  const [newIssueOption, setNewIssueOption] = useState(null);
  const [options, setOptions] = useState(
    createOptionsArray(me?.professional?.organization?.issues),
  );

  const confirm = useConfirm({
    size: 'sm',
    message: 'Are you sure? This will permanently delete legal issue and all of its data.',
    negativeBtnLabel: 'Cancel',
    positiveBtnLabel: 'Delete',
  });
  const prevOptionsState = usePrevious(options);
  const prevIssues = usePrevious(me?.professional?.organization?.issues);

  const fieldValue = useMemo(() => values[LEGAL_ISSUE_FIELD], [values]);
  const prevFieldValue = usePrevious(fieldValue);

  const sortedOptions = useMemo(
    () => sortBy(options, option => option.label?.toLowerCase()),
    [options],
  );

  const handleUpdateIssue = useCallback(
    async (data, id) => {
      const mappedOptions = options.map(option =>
        option.value === id ? { ...option, ...data } : option,
      );

      setOptions(mappedOptions);

      try {
        await handleUpdate(data, id);

        setIsOptionUpdated(true);
      } catch (err) {
        setFieldValue(LEGAL_ISSUE_FIELD, prevFieldValue);
      }
    },
    [handleUpdate, options, prevFieldValue, setFieldValue],
  );
  const handleDeleteIssue = useCallback(
    async data => {
      if (!(await confirm())) return null;

      const filteredFieldValue = fieldValue.filter(option => option.value !== data.value);
      const filteredOptions = options.filter(option => option.value !== data.value);

      setOptions(filteredOptions);
      setFieldValue(LEGAL_ISSUE_FIELD, filteredFieldValue);

      try {
        await handleDelete(data);

        setIsOptionUpdated(true);
      } catch (err) {
        setOptions(prevOptionsState);
        setFieldValue(LEGAL_ISSUE_FIELD, prevFieldValue);
      }
    },
    [confirm, fieldValue, handleDelete, options, prevFieldValue, prevOptionsState, setFieldValue],
  );

  const handleCreateIssue = useCallback(
    async ({ name, description }) => {
      const id = me?.professional?.organization.id;

      if (!id) return null;

      const newOption = { value: name, label: name, description, fromServer: false };

      setFieldValue(LEGAL_ISSUE_FIELD, [...values[LEGAL_ISSUE_FIELD], newOption]);

      try {
        const response = await handleCreate(name, description);
        const newIssue = response?.data?.createOrganizationIssue;

        setNewIssueOption({
          value: newIssue.id,
          label: newIssue.name,
          description: newIssue.description,
          fromServer: true,
        });
      } catch (err) {
        setOptions(prevOptionsState);
        setFieldValue(LEGAL_ISSUE_FIELD, prevFieldValue);
      }
    },
    [me, setFieldValue, values, handleCreate, prevOptionsState, prevFieldValue],
  );

  useEffect(() => {
    if (isOptionUpdated) {
      const currentIssues = me?.professional?.organization.issues;

      if (differenceBy(prevIssues, currentIssues, ['name', 'description']).length) {
        setOptions(createOptionsArray(currentIssues));
        setIsOptionUpdated(false);
      }
    }
  }, [fieldValue, isOptionUpdated, me, newIssueOption, options, prevIssues, setFieldValue]);

  useEffect(() => {
    if (newIssueOption) {
      const filteredFieldValue = fieldValue.filter(issue => issue?.fromServer !== false);

      setFieldValue(LEGAL_ISSUE_FIELD, [...filteredFieldValue, newIssueOption]);
      setOptions([...options, newIssueOption]);
      setNewIssueOption(null);
    }
  }, [fieldValue, newIssueOption, options, setFieldValue]);

  return (
    <LegalIssuesContext.Provider
      value={{
        options: sortedOptions,
        handleCreateIssue,
        handleDeleteIssue,
        handleUpdateIssue,
        loading,
      }}
    >
      {children}
    </LegalIssuesContext.Provider>
  );
};

export default LegalIssuesContextProvider;
