import React, { useCallback } from 'react';

import { useMutation } from '@apollo/client';
import { Label } from 'reactstrap';

import Button from 'components/common/Button';

import JurisdictionItem from 'components/ProProfile/forms/jurisdictions/JurisdictionItem';

import useModal from 'hooks/useModal';
import useConfirm from 'hooks/useConfirm';
import useCurrentUser from 'hooks/useCurrentUser';

import UPDATE_PROFESSIONAL from 'graphql/mutations/professional/updateProfessional';
import ME from 'graphql/queries/user/me';

const Jurisdictions = ({ jurisdictions }) => {
  const { me } = useCurrentUser();

  const { open: openCreateModal } = useModal('CREATE_JURISDICTION');
  const { open: openEditModal } = useModal('EDIT_JURISDICTION');

  const [updateProfessional] = useMutation(UPDATE_PROFESSIONAL);

  const confirm = useConfirm({
    title: 'Are you sure you want to delete a jurisdiction?',
    negativeBtnLabel: 'Not this time',
    positiveBtnLabel: 'Delete jurisdiction',
  });

  const removeLocation = useCallback(
    async jurisdictionId => {
      if (!(await confirm())) return;

      await updateProfessional({
        variables: {
          where: {
            id: me?.professional?.id,
          },
          data: {
            jurisdiction: {
              delete: [
                {
                  id: jurisdictionId,
                },
              ],
            },
          },
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateProfessional: {
            __typename: 'Professional',
            jurisdiction: {
              __typename: 'ProfessionalJurisdiction',
              id: jurisdictionId,
            },
          },
        },
        update: (proxy, { data }) => {
          const removedJurisdictionId = data.updateProfessional?.jurisdiction?.id;
          const variables = { where: { userId: me.id } };

          const cachedData = proxy.readQuery({ query: ME });

          const newData = {
            ...cachedData,
            me: {
              ...cachedData.me,
              professional: {
                ...cachedData.me?.professional,
                jurisdiction: cachedData.me?.professional?.jurisdiction?.filter(
                  jurisdiction => jurisdiction?.id !== removedJurisdictionId,
                ),
              },
            },
          };

          if (removedJurisdictionId) {
            proxy.writeQuery({
              query: ME,
              variables,
              data: newData,
            });
          }
        },
      });
    },
    [confirm, me, updateProfessional],
  );

  return (
    <div className='jurisdiction-form'>
      <Label className='form-control-label'>
        Jurisdictions <span className='required'>*</span>
      </Label>
      {jurisdictions?.map(d => (
        <JurisdictionItem
          jurisdiction={d}
          key={d?.id}
          edit={() => openEditModal({ jurisdiction: d })}
          remove={() => removeLocation(d?.id)}
        />
      ))}
      <Button color='link' leftIcon='plus' size='lg' onClick={() => openCreateModal()}>
        Add a jurisdiction
      </Button>
    </div>
  );
};

export default Jurisdictions;
