import { useEffect, useRef } from 'react';

const usePrevValue = value => {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};

export default usePrevValue;
