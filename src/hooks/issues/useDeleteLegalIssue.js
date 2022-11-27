import { useCallback } from 'react';

import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';

import DELETE_ORGANIZATION_ISSUE from 'graphql/mutations/organization/issues/deleteOrganizationIssue';
import ME from 'graphql/queries/user/me';

const useDeleteLegalIssue = () => {
  const [deleteOrganizationIssue] = useMutation(DELETE_ORGANIZATION_ISSUE);

  const handleDelete = useCallback(
    ({ value: id }) =>
      toast.promise(
        deleteOrganizationIssue({
          variables: { where: { id } },
          update: (cache, { data: response }) => {
            if (!response?.deleteOrganizationIssue) return null;

            const { me } = cache.readQuery({ query: ME });

            if (!me?.professional?.organization.issues) return null;

            const filteredIssues = me.professional.organization.issues.filter(
              issue => issue.id !== id,
            );

            cache.writeQuery({
              query: ME,
              data: {
                me: {
                  ...me,
                  professional: {
                    ...me.professional,
                    organization: {
                      ...me.professional.organization,
                      issues: filteredIssues,
                    },
                  },
                },
              },
            });
          },
        }),
        {
          pending: `Deleting...`,
          success: `Legal issue deleted`,
          error: `Legal issue is not deleted`,
        },
      ),
    [deleteOrganizationIssue],
  );

  return handleDelete;
};

export default useDeleteLegalIssue;
