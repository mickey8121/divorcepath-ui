import React, { Fragment, useCallback, useMemo, useState } from 'react';

import classNames from 'classnames';
import { Collapse } from 'reactstrap';

import Icon from 'components/common/Icon';

import Biography from 'components/ClientProfile/Biography';

import useCurrentUser from 'hooks/useCurrentUser';

import getCompleteProfilePercent from 'utils/getCompleteProfilePercent';

const BiographyCollapse = () => {
  const { me } = useCurrentUser();

  const client = useMemo(() => me?.client, [me?.client]);

  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = useCallback(() => setIsOpen(prev => !prev), []);

  const { profileProgress: clientProfileProgress } = useMemo(() => client, [client]);

  const profileProgress = useMemo(
    () => getCompleteProfilePercent(clientProfileProgress),
    [clientProfileProgress],
  );

  return (
    <Fragment>
      <div className={classNames('profile-bio-row', { open: isOpen })} onClick={toggleCollapse}>
        <div className='row-description'>
          <h6 className='description-title'>Your profile</h6>
          <span className='description-subtitle'>{` ${profileProgress}% complete`}</span>
        </div>

        <span className='row-icon btn-inner--icon mt-n1'>
          <Icon name={`arrow-${isOpen ? 'up' : 'down'}`} width='22' height='22' />
        </span>
      </div>
      <Collapse className='pl-0 mt-0 biography-collapse' isOpen={isOpen}>
        <Biography client={client} isClient />
      </Collapse>
    </Fragment>
  );
};

export default BiographyCollapse;
