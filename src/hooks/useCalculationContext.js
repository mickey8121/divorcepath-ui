import { useContext } from 'react';

import CalculationContext from 'context/CalculationContext/CalculationContext';

const useCalculationContext = () => {
  const context = useContext(CalculationContext);

  return context;
};

export default useCalculationContext;
