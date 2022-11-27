import React, { memo, useMemo } from 'react';

import Button from 'components/common/Button';
import Modal from 'components/common/Modal';

import useCurrentUser from 'hooks/useCurrentUser';
import useModal from 'hooks/useModal';

import getQuantityTimeLeft from 'utils/getQuantityTimeLeft';

export const CANCEL_PLAN = 'CANCEL_PLAN';

const CancelPlanModal = () => {
  const { me, isPro } = useCurrentUser();

  const { close } = useModal(CANCEL_PLAN);

  const description = useMemo(
    () =>
      `Your plan will automatically change to a free plan when your current subscription 
    expires in ${getQuantityTimeLeft(me?.subscription)}. You will not be billed again, and no 
    further action is required.`,
    [me],
  );

  const title = useMemo(() => (isPro ? 'Subscription canceled' : 'Current plan'), [isPro]);

  return (
    <Modal
      autoFocus={false}
      size='md'
      name={CANCEL_PLAN}
      form={CANCEL_PLAN}
      returnFocusAfterClose={false}
      hideCancel
      customOkBtn={
        <Button form={CANCEL_PLAN} color='primary' size='sm' onClick={close}>
          Ok
        </Button>
      }
      cancelBtnTitle='Delete my account'
      title={title}
      description={description}
      borderedHeader={false}
    />
  );
};
export default memo(CancelPlanModal);
