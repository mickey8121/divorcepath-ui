import React, { useMemo } from 'react';

import CreateDegreeModal from 'components/modals/proProfile/CreateDegreeModal';
import EditDegreeModal from 'components/modals/proProfile/EditDegreeModal';
import CreateJurisdictionModal from 'components/modals/proProfile/CreateJurisdictionModal';
import EditJurisdictionModal from 'components/modals/proProfile/EditJurisdictionModal';

import Jurisdictions from 'components/ProProfile/forms/jurisdictions/Jurisdictions';
import Degrees from 'components/ProProfile/forms/degree/Degrees';

import useCurrentUser from 'hooks/useCurrentUser';

const DegreesAndJurisdictionsForm = () => {
  const { me } = useCurrentUser();

  const degree = useMemo(() => me?.professional?.degree || [], [me?.professional]);
  const jurisdiction = useMemo(() => me.professional?.jurisdiction || [], [me?.professional]);

  return (
    <div className='update-form degree-and-jurisdictions-form'>
      <div className='inputs-container'>
        <div className='left-side'>
          <h4 className='title'>Degrees and Jurisdictions</h4>
          <p className='subtitle'>
            Complete your professional profile using the form on the right.
          </p>
          <p className='subtitle'>* required for public profile</p>
        </div>
        <div className='right-side'>
          <Degrees degrees={degree} />

          <Jurisdictions jurisdictions={jurisdiction} />
        </div>
      </div>

      <CreateDegreeModal />
      <EditDegreeModal />

      <CreateJurisdictionModal />
      <EditJurisdictionModal />
    </div>
  );
};

export default DegreesAndJurisdictionsForm;
