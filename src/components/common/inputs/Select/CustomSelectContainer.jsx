import React, { useCallback } from 'react';

import { components } from 'react-select';

import CustomSelect from 'components/common/inputs/Select/SelectField';

import useCalculationContext from 'hooks/useCalculationContext';

const CustomSelectContainer = props => {
  const { isSubscriptionActive } = useCalculationContext();

  const Option = useCallback(
    optionProps =>
      !isSubscriptionActive && !optionProps.data.isPremiumAvailable ? (
        <div className='upgrade'>
          <components.Option {...optionProps} />
        </div>
      ) : (
        <components.Option {...optionProps} />
      ),
    [isSubscriptionActive],
  );

  return <CustomSelect components={{ Option }} {...props} />;
};

export default CustomSelectContainer;
