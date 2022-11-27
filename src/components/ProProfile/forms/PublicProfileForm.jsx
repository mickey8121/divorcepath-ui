import React, { useMemo, useCallback, useState } from 'react';

import classNames from 'classnames';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';

import ToggleCheckbox from 'components/common/inputs/ToggleCheckbox';
import WarningModal from 'components/modals/proProfile/WarningModal';

import { regionsKeys } from 'components/calculations/utils/regionNames';

import useCurrentUser from 'hooks/useCurrentUser';
import useModal from 'hooks/useModal';

import { encodeValueForLink } from 'utils/prepareLinkValue';

import UPDATE_PROFESSIONAL from 'graphql/mutations/professional/updateProfessional';

const PublicProfileForm = () => {
  const { me } = useCurrentUser();

  const { open } = useModal('WARNING');

  const handleOpenModal = useCallback(() => open(), [open]);

  const [loading, setLoading] = useState(false);

  const [updateProfessional] = useMutation(UPDATE_PROFESSIONAL);

  const isToggleEnabled = useMemo(() => {
    const {
      email,
      professional: { biography, degree, jurisdiction, locations, profile, type },
    } = me;

    return (
      email &&
      biography &&
      type &&
      profile?.firstName &&
      profile?.lastName &&
      profile?.phone &&
      !!locations?.length &&
      !!degree?.length &&
      !!jurisdiction?.length
    );
  }, [me]);

  const link = useMemo(() => {
    const location = me?.professional?.locations?.filter(l => l.residence)[0];
    const province = encodeValueForLink(regionsKeys[location?.residence]) || '';

    if (province) {
      return `https://dev.divorcepath.com/intake/family-lawyers/${province}/professionals/${me?.professional?.id}`;
    }
  }, [me]);

  const publicPageEnabled = useMemo(() => me?.professional?.publicPageEnabled, [me?.professional]);

  const handleChange = useCallback(async () => {
    try {
      setLoading(true);
      const toastId = toast.loading('Updating profile...');

      await updateProfessional({
        variables: {
          where: { id: me?.professional?.id },
          data: { publicPageEnabled: !publicPageEnabled },
        },
      });

      toast.dismiss(toastId);
      toast.success(`Your profile is now ${publicPageEnabled ? 'private' : 'public'}`);
    } catch (error) {
      toast.dismiss();
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [me?.professional?.id, updateProfessional, publicPageEnabled]);

  return (
    <div className='update-form public-profile-form'>
      <div className='inputs-container'>
        <div className='left-side'>
          <h4 className='title'>Public Profile</h4>
          <p className='subtitle'>
            Feature your public profile on Divorcepath's family law directory and advertise on the
            support calculator.
          </p>
        </div>
        <div className='right-side'>
          <div className='public-profile-toggle'>
            <ToggleCheckbox
              disabled={loading}
              onChange={isToggleEnabled || publicPageEnabled ? handleChange : handleOpenModal}
              margin='mr-3'
              isChecked={publicPageEnabled}
            />
            <a
              href={publicPageEnabled ? link : '/app/profile'}
              target='_blank'
              rel='noopener noreferrer'
              className={classNames({ disabled: !publicPageEnabled })}
            >
              View your public profile
            </a>
          </div>
        </div>
      </div>
      <WarningModal />
    </div>
  );
};

export default PublicProfileForm;
