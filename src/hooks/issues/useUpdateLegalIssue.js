import { useCallback } from 'react';

import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';

import UPDATE_ORGANIZATION_ISSUE from 'graphql/mutations/organization/issues/updateOrganizationIssue';

const useUpdateLegalIssue = () => {
  const [updateOrganizationIssue] = useMutation(UPDATE_ORGANIZATION_ISSUE);

  const handleUpdate = useCallback(
    (data, id) =>
      toast.promise(
        updateOrganizationIssue({
          variables: { data, where: { id } },
        }),
        {
          pending: `Updating...`,
          success: `Legal issue updated`,
          error: `Legal issue is not updated`,
        },
      ),
    [updateOrganizationIssue],
  );

  return handleUpdate;
};

export default useUpdateLegalIssue;
