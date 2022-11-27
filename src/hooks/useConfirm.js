import { useCallback } from 'react';

import { useDispatch } from 'react-redux';

import { showAlert } from 'ducks/alert';

const useConfirm = options => {
  const dispatch = useDispatch();

  const handleAction = useCallback(cb => {
    if (cb) cb();
  }, []);

  const confirm = overridenOptions =>
    new Promise(resolve => {
      dispatch(
        showAlert({
          ...options,
          onSubmit: () => {
            handleAction(options?.onSubmit);
            resolve(true);
          },
          onCancel: () => {
            handleAction(options?.onCancel);
            resolve(false);
          },
          ...overridenOptions,
        }),
      );
    });

  return confirm;
};

export default useConfirm;
