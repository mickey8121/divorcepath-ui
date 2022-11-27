/* eslint-disable no-console */
import React from 'react';

import { useParams } from 'react-router';
import { useMutation, useApolloClient } from '@apollo/client';

import Button from 'components/common/Button';

import useCalculationContext from 'hooks/useCalculationContext';
import useCurrentUser from 'hooks/useCurrentUser';

import DUPLICATE_SUPPORT_CALCULATION from 'graphql/mutations/calculations/duplicateSupportCalculation';
import PREVIOUS_SUPPORT_CALCULATIONS from 'graphql/queries/calculations/previousSuppportCalculations';

const DuplicateCalculationButton = () => {
  const apolloClient = useApolloClient();

  const { me } = useCurrentUser();

  const { supportCalculation } = useCalculationContext();

  const [duplicateSupportCalculation, { loading }] = useMutation(DUPLICATE_SUPPORT_CALCULATION);

  const { calculationId, clientId } = useParams();

  const handleClick = () => {
    const variables = { data: { supportCalculationId: calculationId, clientId } };

    duplicateSupportCalculation({
      variables,
      optimisticResponse: {
        __typename: 'Mutation',
        duplicateSupportCalculation: {
          __typename: 'DuplicateSupportCalculationResponse',
          calculation: {
            __typename: 'SupportCalculation',
            id: '',
            title: `Copy of ${supportCalculation.title}`,
            showSpousalSupport: supportCalculation.showSpousalSupport,
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            client: {
              __typename: 'Client',
              id: supportCalculation?.client?.id,
            },
          },
        },
      },
    })
      .then(({ data }) => {
        try {
          const newCalc = data?.duplicateSupportCalculation?.calculation;

          const prevSupportVariables = { where: { clientId: { equals: clientId } } };

          if (!me?.client?.id) {
            const cachedData = apolloClient.readQuery({
              query: PREVIOUS_SUPPORT_CALCULATIONS,
              variables: prevSupportVariables,
              skip: !clientId,
            });

            const newData = {
              ...cachedData,
              supportCalculations: [...cachedData.supportCalculations, newCalc],
            };

            apolloClient.writeQuery({
              query: PREVIOUS_SUPPORT_CALCULATIONS,
              variables: prevSupportVariables,
              data: newData,
            });
          }
        } catch (error) {}
      })
      .catch(() => {});
  };

  return (
    <Button
      disabled={loading}
      size='lg'
      className='btn-duplicate'
      onClick={handleClick}
      leftIcon={loading ? 'spinner' : 'document-duplicate'}
      spin={loading}
    >
      Copy
    </Button>
  );
};

export default DuplicateCalculationButton;
