import React, { useEffect } from 'react';
import { useMutation } from 'react-apollo';
import { Redirect } from 'react-router';

import customGet from 'utils/get';
import Preloader from 'components/common/Preloader';
import CREATE_SUPPORT_CALCULATIONS from 'graphql/mutations/calculations/createSupportCalculation';

const CreateNewCalculation = ({ match }) => {
  const [createSupportCalculation, { loading, data, called }] = useMutation(
    CREATE_SUPPORT_CALCULATIONS,
  );

  useEffect(() => {
    const clientId = customGet(match, 'params.clientId', false);

    if (clientId) {
      createSupportCalculation({ variables: { data: { client: { connect: { clientId } } } } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createdSupportCalculationId = customGet(data, 'createSupportCalculation.id', '');

  if (called && !loading) {
    return <Redirect to={`${match.url}${createdSupportCalculationId}`} />;
  }

  return <Preloader />;
};

export default CreateNewCalculation;
