import React, { useCallback, useMemo } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import { Modal as BootstrapModal, ModalBody, ModalFooter } from 'reactstrap';

import Button from 'components/common/Button';

import { toggleModal, clearModal } from 'ducks/modal';

const Modal = ({
  customOkBtn,
  okButton,
  name,
  form,
  title,
  titleComponent,
  noHeader,
  children,
  onClosed,
  hideCancel,
  description,
  onSubmitClick,
  onCancelClick,
  onDeleteClick,
  deleteButtonTitle = 'Delete',
  deleteClassName,
  selectedItems,
  showCloseButton,
  borderedHeader,
  borderedFooter,
  bodyClassName,
  centered = true,
  customContent = false,
  submitButtonTitle = 'OK',
  closeButtonTitle = 'Close',
  submitButtonColor = 'primary',
  cancelBtnTitle = 'Cancel',
  titleScalingForDescription = true,
  ...modalProps
}) => {
  const dispatch = useDispatch();
  const isOpen = useSelector(({ modal }) => !!modal[name]?.isOpen);
  const { options, loading, disabled } = useSelector(({ modal }) => modal[name]) || {};

  const toggle = useCallback(() => dispatch(toggleModal(name)), [dispatch, name]);

  const handleCancel = useCallback(async () => {
    if (options.onCancelClick) await options.onCancelClick();
    if (onCancelClick) await onCancelClick();
    toggle();
  }, [options, onCancelClick, toggle]);

  const handleSubmit = useCallback(
    async e => {
      if (options.onSubmitClick) await options.onSubmitClick(e);
      if (onSubmitClick) await onSubmitClick(e);
      toggle();
    },
    [onSubmitClick, options, toggle],
  );

  const handleClosed = useCallback(() => {
    if (onClosed) onClosed();
    dispatch(clearModal(name));
  }, [dispatch, name, onClosed]);

  const handleDelete = useCallback(async () => {
    if (options.onDeleteClick) await options.onDeleteClick();
    if (onDeleteClick) await onDeleteClick();
    toggle();
  }, [onDeleteClick, options, toggle]);

  const headerClassName = classnames({ bordered: borderedHeader });
  const footerClassName = classnames({ bordered: borderedFooter });

  const props = useMemo(
    () => ({
      isOpen,
      toggle,
      centered,
      ...modalProps,
      onClosed: handleClosed,
    }),
    [centered, handleClosed, isOpen, modalProps, toggle],
  );

  const renderCancelBtn = useCallback(() => {
    if (hideCancel) return <span />;

    return (
      <Button
        size='sm'
        color='secondary'
        onClick={handleCancel}
        className='btn-cancel'
        disabled={loading}
      >
        {cancelBtnTitle}
      </Button>
    );
  }, [handleCancel, hideCancel, cancelBtnTitle, loading]);

  const renderDeleteBtn = useCallback(
    () => (
      <Button
        size='sm'
        leftIcon='trash'
        onClick={handleDelete}
        color='red-link'
        className={deleteClassName}
      >
        {deleteButtonTitle}
      </Button>
    ),
    [deleteButtonTitle, deleteClassName, handleDelete],
  );

  const renderSubmitBtn = useCallback(() => {
    if (customOkBtn) return customOkBtn;

    return (
      <Button
        form={form}
        color={submitButtonColor}
        size='sm'
        disabled={disabled || loading}
        type={form ? 'submit' : 'button'}
        onClick={form ? undefined : handleSubmit}
        className='btn-submit'
        {...okButton}
      >
        {options?.customSubmitBtnText || submitButtonTitle}
      </Button>
    );
  }, [
    customOkBtn,
    disabled,
    form,
    handleSubmit,
    loading,
    okButton,
    options,
    submitButtonColor,
    submitButtonTitle,
  ]);

  if (customContent) {
    return (
      <BootstrapModal {...props}>
        {children && (
          <ModalBody className='custom-content'>
            {React.Children.map(children, child => React.cloneElement(child, options))}
          </ModalBody>
        )}
      </BootstrapModal>
    );
  }

  return (
    <BootstrapModal {...props}>
      {!noHeader && (title || titleComponent) && (
        <div
          className={classnames('modal-header', headerClassName, {
            'with-close': showCloseButton,
          })}
        >
          <div className='modal-header-title-row'>
            <h5
              className={classnames('modal-title', {
                'with-description': !!description && titleScalingForDescription,
              })}
            >
              {title && title}
              {titleComponent && titleComponent}
            </h5>
          </div>
          {!!description && (
            <p
              className={classnames('modal-description', {
                'no-scaled-title': !titleScalingForDescription,
              })}
            >
              {description}
            </p>
          )}
          {showCloseButton && (
            <Button onClick={handleCancel} className='modal-close'>
              {closeButtonTitle}
            </Button>
          )}
        </div>
      )}
      {children && (
        <ModalBody className={bodyClassName}>
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, options);
            }

            return child;
          })}
          {options?.onDeleteClick && renderDeleteBtn()}
        </ModalBody>
      )}
      <ModalFooter className={footerClassName}>
        {renderSubmitBtn()}
        {renderCancelBtn()}
        {onDeleteClick && renderDeleteBtn()}
      </ModalFooter>
    </BootstrapModal>
  );
};

export default Modal;
