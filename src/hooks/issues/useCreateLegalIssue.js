import { useCallback, useMemo } from 'react';

import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';

import useCurrentUser from 'hooks/useCurrentUser';

import CREATE_ORGANIZATION_ISSUE from 'graphql/mutations/organization/issues/createOrganizationIssue';
import ME from 'graphql/queries/user/me';

const useCreateLegalIssue = () => {
  const { me } = useCurrentUser();
  const [createOrganizationIssue, { loading }] = useMutation(CREATE_ORGANIZATION_ISSUE);

  const id = useMemo(() => me?.professional?.organization?.id, [me]);

  const handleCreate = useCallback(
    (name, description) =>
      toast.promise(
        createOrganizationIssue({
          variables: {
            data: {
              name,
              description,
              organization: { connect: { id } },
            },
          },
          update: (cache, { data: response }) => {
            const newIssue = response?.createOrganizationIssue;

            if (!newIssue) return null;

            const { me: currentMe } = cache.readQuery({ query: ME });

            const currentIssues = currentMe?.professional?.organization.issues;

            if (!currentIssues) return null;

            cache.writeQuery({
              query: ME,
              data: {
                me: {
                  ...currentMe,
                  professional: {
                    ...currentMe.professional,
                    organization: {
                      ...currentMe.professional.organization,
                      issues: [...currentIssues, newIssue],
                    },
                  },
                },
              },
            });
          },
        }),
        {
          pending: `Creating...`,
          success: `Legal issue created`,
          error: `Legal issue is not created`,
        },
      ),
    [createOrganizationIssue, id],
  );

  return { handleCreate, loading };
};

export default useCreateLegalIssue;
