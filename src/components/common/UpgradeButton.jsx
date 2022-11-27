import React from 'react';

import Button from 'components/common/Button';
import { UPGRADE_PLAN_MODAL_NAME } from 'components/modals/upgrade/UpgradePlanModal';

import useModal from 'hooks/useModal';

const UpgradeButton = ({ children, size = 'md', ...props }) => {
  const { open } = useModal(UPGRADE_PLAN_MODAL_NAME);

  return (
    <Button id='upgradeButton' size={size} onClick={open} {...props}>
      {children || 'Upgrade'}
    </Button>
  );
};

export default UpgradeButton;
