import { useCallback } from 'react';

import { defaultPlansForAnalytics } from 'components/calculations/utils/defaultValues';

import useCurrentUser from 'hooks/useCurrentUser';

import get from 'utils/get';

const usePlanForAnalytics = () => {
  const { currentPeriodPlanLength } = useCurrentUser();

  const getPlanForAnalytics = useCallback(
    (planCode, isProfessional) => {
      const planType = isProfessional ? 'pro' : 'client';
      const planField = isProfessional ? 'subscription' : currentPeriodPlanLength ?? 1;

      if (planCode === 'FREE') {
        return get(defaultPlansForAnalytics, `${planType}.freePlan.${planCode}`, null);
      }

      return get(defaultPlansForAnalytics, `${planType}.${planField}.${planCode}`, null);
    },
    [currentPeriodPlanLength],
  );

  return getPlanForAnalytics;
};

export default usePlanForAnalytics;
