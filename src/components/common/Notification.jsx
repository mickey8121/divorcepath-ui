import React, { useCallback, useMemo, useState } from 'react';

import classnames from 'classnames';

import Button from 'components/common/Button';

const Notification = ({ header, body, name, onClose, footer, className, containerClassName }) => {
  const [isShow, setIsShow] = useState(true);

  const closeHandler = useCallback(() => {
    if (onClose) onClose();

    setIsShow(false);
  }, [onClose]);

  const dontShowAgain = useCallback(() => {
    if (onClose) onClose();

    localStorage.setItem(name, 'false');

    setIsShow(false);
  }, [onClose, name]);

  const isDontShow = useMemo(() => localStorage.getItem(name) === 'false', [name]);

  if (!isShow || isDontShow) return null;

  return (
    <div className={classnames('notification-card', containerClassName)}>
      <div className='container-fluid m-0 p-0 row'>
        <div className={classnames('body-container', className)}>
          {header && <div className='card-header'>{header}</div>}

          {body && <div className='card-body p-0'>{body}</div>}

          {footer && (
            <div className='border-top-0 card-footer d-flex p-0'>
              <Button color='link' size='sm' onClick={closeHandler} className='noty-btn'>
                Close
              </Button>

              <Button color='link' size='sm' onClick={dontShowAgain} className='noty-btn'>
                Don’t show me again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
