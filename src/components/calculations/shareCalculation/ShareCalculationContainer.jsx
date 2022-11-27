import React from 'react';

import { Redirect, useParams } from 'react-router';
import { useQuery } from '@apollo/client';

import Loading from 'components/common/Loading';

import SupportCalculationContainer from 'components/calculations/SupportCalculationContainer';

import useCurrentUser from 'hooks/useCurrentUser';

import SHARED_SUPPORT_CALCULATION_BY_TOKEN from 'graphql/queries/calculations/sharedSupportCalculationByToken';

const ShareCalculationContainer = () => {
  const { sharedToken } = useParams();
  localStorage.removeItem('sharedCalcId');

  const { data, loading } = useQuery(SHARED_SUPPORT_CALCULATION_BY_TOKEN, {
    variables: { where: { shareToken: sharedToken } },
    skip: !sharedToken,
  });

  const { sharedSupportCalculationByToken: { id } = {} } = data || {};

  const { me } = useCurrentUser();

  if (data) {
    return <Redirect to={`/shared-calculation/${id}`} />;
  }

  if (loading) {
    return <Loading page />;
  }

  if (!me?.id) {
    return <Redirect to='/sign-in' />;
  }

  return <SupportCalculationContainer />;
};

export default ShareCalculationContainer;
