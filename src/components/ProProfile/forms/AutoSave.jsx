import { useEffect } from 'react';

import { useDebouncedCallback } from 'use-debounce';

import difference from 'components/calculations/utils/difference';

import usePrevValue from 'hooks/usePrevValue';

const AutoSave = ({ handleSubmit, values }) => {
  const prevValues = usePrevValue(values);

  const debouncedSubmit = useDebouncedCallback(async () => handleSubmit(), 3000);

  useEffect(() => {
    if (Object.keys(difference(values, prevValues) || {}).length) {
      debouncedSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, prevValues]);

  return null;
};

export default AutoSave;
