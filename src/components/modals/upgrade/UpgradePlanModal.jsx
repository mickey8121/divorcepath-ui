import React from 'react';

import { Link } from 'react-router-dom';
import classnames from 'classnames';

import Modal from 'components/common/Modal';
import Button from 'components/common/Button';
import FeaturesList from 'components/modals/upgrade/FeaturesList';

import useModal from 'hooks/useModal';
import useCurrentUser from 'hooks/useCurrentUser';

export const UPGRADE_PLAN_MODAL_NAME = 'UPGRADE_PLAN';

const UpgradePlanModal = () => {
  const { isPro } = useCurrentUser();

  const { close } = useModal(UPGRADE_PLAN_MODAL_NAME);

  return (
    <Modal
      autoFocus={false}
      size='lg'
      name={UPGRADE_PLAN_MODAL_NAME}
      className={classnames('upgrade-plan-modal', { pro: isPro, client: !isPro })}
      title='Upgrade for Premium Features'
      showCloseButton
      closeButtonTitle=''
      cancelBtnTitle='Not Now'
      borderedHeader={false}
      borderedFooter={false}
      returnFocusAfterClose={false}
      customOkBtn={
        <Button
          color='primary'
          size='md'
          onClick={close}
          type='button'
          tag={Link}
          to='/plans'
          className='btn-submit'
        >
          Choose Plan
        </Button>
      }
    >
      <FeaturesList />
    </Modal>
  );
};

export default UpgradePlanModal;
