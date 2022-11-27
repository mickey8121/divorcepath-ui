import React, { useCallback } from 'react';

import { useMutation } from '@apollo/client';
import { Label } from 'reactstrap';

import Button from 'components/common/Button';

import DegreeItem from 'components/ProProfile/forms/degree/DegreeItem';

import useModal from 'hooks/useModal';
import useConfirm from 'hooks/useConfirm';
import useCurrentUser from 'hooks/useCurrentUser';

import UPDATE_PROFESSIONAL from 'graphql/mutations/professional/updateProfessional';
import ME from 'graphql/queries/user/me';

const Degrees = ({ degrees }) => {
  const { me } = useCurrentUser();

  const { open: openCreateModal } = useModal('CREATE_DEGREE');
  const { open: openEditModal } = useModal('EDIT_DEGREE');

  const [updateProfessional] = useMutation(UPDATE_PROFESSIONAL);

  const confirm = useConfirm({
    title: 'Are you sure you want to delete a degree?',
    negativeBtnLabel: 'Delete degree',
    positiveBtnLabel: 'Not this time',
  });

  const removeLocation = useCallback(
    async degreeId => {
      if (await confirm()) return;

      await updateProfessional({
        variables: {
          where: {
            id: me?.professional?.id,
          },
          data: {
            degree: {
              delete: [
                {
                  id: degreeId,
                },
              ],
            },
          },
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateProfessional: {
            __typename: 'Professional',
            degree: {
              __typename: 'ProfessionalDegree',
              id: degreeId,
            },
          },
        },
        update: (proxy, { data }) => {
          const removedDegreeId = data.updateProfessional.degree?.id;
          const variables = { where: { userId: me.id } };

          const cachedData = proxy.readQuery({ query: ME });

          const newData = {
            ...cachedData,
            me: {
              ...cachedData.me,
              professional: {
                ...cachedData.me?.professional,
                degree: cachedData.me?.professional?.degree?.filter(
                  degree => degree?.id !== removedDegreeId,
                ),
              },
            },
          };

          if (removedDegreeId) {
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
    <div className='degree-form'>
      <Label className='form-control-label'>
        Degrees <span className='required'>*</span>
      </Label>
      {degrees?.map(d => (
        <DegreeItem
          degree={d}
          key={d?.id}
          edit={() => openEditModal({ degree: d })}
          remove={() => removeLocation(d?.id)}
        />
      ))}
      <Button color='link' size='lg' leftIcon='plus' onClick={() => openCreateModal()}>
        Add a degree
      </Button>
    </div>
  );
};

export default Degrees;
