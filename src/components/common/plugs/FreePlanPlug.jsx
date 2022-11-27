import React, { memo } from 'react';

import { useHistory } from 'react-router';

import Button from 'components/common/Button';

import { ReactComponent as FreePlanPlugImage } from 'img/plugs/free-plan-plug.svg';

const FreePlanPlug = ({ title, description, btnTitle = 'Upgrade', btnPath = '/plans' }) => {
  const history = useHistory();

  return (
    <div className='free-plan-plug'>
      <div className='plug-content'>
        {!!title && <h2 className='plug-content-title'>{title}</h2>}
        {!!description && <span className='plug-content-description'>{description}</span>}
        {!!btnTitle && <Button onClick={() => history.push(btnPath)}>{btnTitle}</Button>}
      </div>

      <FreePlanPlugImage className='free-plan-plug-svg' />
    </div>
  );
};

export default memo(FreePlanPlug);
