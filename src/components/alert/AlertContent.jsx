/* eslint-disable react/jsx-props-no-spreading */
import React, { Fragment, useCallback, useEffect, useMemo } from 'react';

import classnames from 'classnames';
import { ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import Button from 'components/common/Button';

const AlertContent = ({ options, toggle }) => {
  const {
    borderedFooter,
    title,
    bigTitle,
    titleComponent,
    subtitle,
    hint,
    message,
    messageComponent,
    noButtons,
    timeout,
    positiveBtnLabel,
    negativeBtnLabel,
    onSubmit,
    onCancel,
    okButton,
    showCloseButton,
    closeButtonTitle,
    reversedButtons,
    showOk = false,
    submitAutoFocus = true,
  } = options || {};

  const handleCancel = useCallback(() => {
    if (onCancel) onCancel();
    toggle();
  }, [onCancel, toggle]);

  const handleSubmit = useCallback(() => {
    if (onSubmit) onSubmit();
    toggle();
  }, [onSubmit, toggle]);

  useEffect(() => {
    if (timeout) {
      const t = setTimeout(() => toggle(), timeout);

      return () => clearInterval(t);
    }

    return () => undefined;
  }, [timeout, toggle]);

  const onlyTitle = useMemo(
    () => title && !subtitle && !message && !messageComponent,
    [message, subtitle, title, messageComponent],
  );

  const footerClassName = classnames({ bordered: borderedFooter });

  return (
    <Fragment>
      {title && (
        <ModalHeader
          className={classnames({
            big: bigTitle,
            'pb-4': onlyTitle,
            'with-close': showCloseButton,
          })}
        >
          {title}
          {showCloseButton && (
            <Button onClick={handleCancel} className='modal-close'>
              {closeButtonTitle}
            </Button>
          )}
        </ModalHeader>
      )}
      {titleComponent && (
        <ModalHeader className={classnames({ big: bigTitle, 'pb-4': onlyTitle })}>
          {titleComponent()}
        </ModalHeader>
      )}
      {subtitle && (
        <ModalHeader className='subtitle bordered'>
          {subtitle}
          {hint && <p className='hint'>{hint}</p>}
        </ModalHeader>
      )}
      {message && (
        <ModalBody>
          <p className='text'>{message}</p>
        </ModalBody>
      )}
      {messageComponent && <ModalBody>{messageComponent}</ModalBody>}
      {!noButtons && (
        <ModalFooter className={footerClassName}>
          {reversedButtons ? (
            <Fragment>
              <Button size='sm' color='primary' onClick={handleCancel}>
                {negativeBtnLabel || 'Cancel'}
              </Button>
              <Button
                autoFocus={submitAutoFocus}
                size='sm'
                className='btn-cancel'
                onClick={handleSubmit}
                {...okButton}
              >
                {positiveBtnLabel || 'Ok'}
              </Button>
            </Fragment>
          ) : (
            <Fragment>
              <Button
                autoFocus={submitAutoFocus}
                color='primary'
                size='sm'
                onClick={handleSubmit}
                {...okButton}
              >
                {positiveBtnLabel || 'Ok'}
              </Button>
              <Button size='sm' color='link' className='btn-cancel' onClick={handleCancel}>
                {negativeBtnLabel || 'Cancel'}
              </Button>
            </Fragment>
          )}
        </ModalFooter>
      )}
      {showOk && (
        <ModalFooter className='justify-content-end pt-0'>
          <Button autoFocus={submitAutoFocus} color='primary' size='sm' onClick={handleSubmit}>
            {positiveBtnLabel || 'Ok'}
          </Button>
        </ModalFooter>
      )}
    </Fragment>
  );
};

export default AlertContent;
