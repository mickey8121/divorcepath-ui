import React, { useCallback } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import { Modal } from 'reactstrap';

import AlertContent from 'components/alert/AlertContent';

import { closeAlert } from 'ducks/alert';

const Alert = () => {
  const dispatch = useDispatch();
  const { isOpen, className, onClosed, ...options } = useSelector(({ alert }) => alert);

  const toggle = useCallback(() => dispatch(closeAlert()), [dispatch]);

  return (
    <Modal
      autoFocus={false}
      isOpen={isOpen}
      onClosed={onClosed}
      toggle={toggle}
      centered
      size={options.size || 'sm'}
      className={classnames('alert-confirm', className)}
    >
      <AlertContent toggle={toggle} options={options} />
    </Modal>
  );
};

export default Alert;
