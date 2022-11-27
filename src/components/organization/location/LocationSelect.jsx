import React, { useCallback, useMemo, useState } from 'react';

import { Link } from 'react-router-dom';
import { uniqBy } from 'lodash';

import Select from 'components/common/inputs/Select/Select';

import useCurrentUser from 'hooks/useCurrentUser';
import useUpdateProfessional from 'graphql/hooks/useUpdateProfessional';

const prepare = locations =>
  Array.isArray(locations)
    ? locations?.map(location => ({
        value: location.id || location?.value,
        label: `${location.city} ${location.residence}` || location?.label,
      }))
    : [];

const LocationSelect = ({ locations }) => {
  const options = prepare(locations);

  const [loading, setLoading] = useState(false);

  const { me } = useCurrentUser();

  const [updateProfessional] = useUpdateProfessional();

  const initialLocations = useMemo(() => prepare(me?.professional?.locations || []), [me]);

  const handleSelect = useCallback(
    async selectValue => {
      setLoading(true);

      let lc = selectValue?.map(s => ({ id: s?.value })) || [];

      if (selectValue?.length > initialLocations?.length) {
        lc = [...(initialLocations?.map(location => ({ id: location.value })) || []), ...lc];
      }

      const variables = {
        where: {
          id: me?.professional?.id,
        },
        data: {
          locations: {
            set: uniqBy(lc, u => u?.id),
          },
        },
      };

      try {
        await updateProfessional({ variables });
      } catch {
      } finally {
        setLoading(false);
      }
    },
    [initialLocations, updateProfessional, me],
  );

  const handleClick = useCallback(() => {
    setTimeout(() => {
      const element = document.getElementById('locations');

      if (element?.scrollIntoView) element.scrollIntoView();
    }, 0);
  }, []);

  return (
    <form className='update-form username-form'>
      <div className='inputs-container'>
        <div className='left-side'>
          <h5 className='title'>Your locations</h5>
          <p className='subtitle'>
            Update your location information using the form on the right.{' '}
            <Link to='/profile/organization' onClick={handleClick}>
              Edit organization locations
            </Link>
          </p>
        </div>
        <div className='right-side'>
          <Select
            isMulti
            size='md'
            label='Locations'
            isClearable={false}
            value={initialLocations}
            onChange={handleSelect}
            options={options || []}
            isDisabled={loading}
            isRequired
          />
        </div>
      </div>
    </form>
  );
};

export default LocationSelect;
