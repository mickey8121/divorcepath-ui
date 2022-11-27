import { useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { toggleModal, openModal, closeModal, toggleLoading, toggleDisabled } from 'ducks/modal';

const useModal = (name, options) => {
  const dispatch = useDispatch();

  const open = useCallback(
    (overrideOptions, disabled) =>
      dispatch(openModal(name, { ...options, ...overrideOptions }, disabled)),
    [dispatch, name, options],
  );

  const close = useCallback(() => dispatch(closeModal(name)), [dispatch, name]);

  const toggle = useCallback(
    overrideOptions => dispatch(toggleModal(name, { ...options, ...overrideOptions })),
    [dispatch, name, options],
  );

  const setLoading = useCallback(
    loading => dispatch(toggleLoading(name, loading)),
    [dispatch, name],
  );

  const setDisabled = useCallback(
    disabled => dispatch(toggleDisabled(name, disabled)),
    [dispatch, name],
  );

  const {
    options: modalOptions,
    loading,
    disabled,
  } = useSelector(({ modal }) => modal[name]) || {};

  return {
    open,
    close,
    toggle,
    options: modalOptions,
    loading,
    disabled,
    setLoading,
    setDisabled,
  };
};

export default useModal;
