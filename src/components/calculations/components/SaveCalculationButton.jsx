import React, { useCallback } from 'react';

import { useHistory } from 'react-router-dom';
import { useFormikContext } from 'formik';
import { useMutation, useApolloClient } from '@apollo/client';
import { toast } from 'react-toastify';
import { set } from 'lodash';

import Button from 'components/common/Button';

import useCalculationContext from 'hooks/useCalculationContext';
import useCurrentUser from 'hooks/useCurrentUser';

import getSerializedFormValues from 'utils/getSerializedFormValues';

import CREATE_SUPPORT_CALCULATION from 'graphql/mutations/calculations/createSupportCalculation';
import UPDATE_SUPPORT_CALCULATION from 'graphql/mutations/calculations/updateSupportCalculation';
import PREVIOUS_SUPPORT_CALCULATIONS from 'graphql/queries/calculations/previousSuppportCalculations';

const SaveCalculationButton = () => {
  const { values } = useFormikContext();
  const { type, client, calculationId, calculatorType } = useCalculationContext();
  const { me, isPro } = useCurrentUser();

  const { push } = useHistory();

  const apolloClient = useApolloClient();
  const [mutate, { loading }] = useMutation(
    type === 'create' ? CREATE_SUPPORT_CALCULATION : UPDATE_SUPPORT_CALCULATION,
  );

  const handleClick = useCallback(() => {
    const variables = {
      data: {
        ...values,
        recalculate: false,
      },
    };

    const { firstName, middleName, lastName } = values?.clientSupportProfile || {};
    const exFirstName = values?.exSupportProfile?.firstName;

    if (client?.id) {
      variables.data.client = {
        connect: {
          id: client?.id,
        },
      };
    } else if (firstName !== 'Client' && exFirstName !== 'Ex') {
      variables.data.client = {
        create: {
          professionals: {
            connect: [
              {
                id: me?.professional?.id,
              },
            ],
          },
          profile: {
            create: {
              firstName,
              middleName,
              lastName,
            },
          },
        },
      };
    }

    const { gender } = values?.clientSupportProfile || {};
    const { gender: exGender } = values?.clientSupportProfile || {};

    if (!gender) set(`variables.clientSupportProfile.gender`, null);
    if (!exGender) set(`variables.exSupportProfile.gender`, null);

    if (type === 'update') {
      variables.where = { id: calculationId };
    }

    const serializedVariables = getSerializedFormValues(variables);

    mutate({ variables: serializedVariables })
      .then(({ data }) => {
        const calculationClient = data?.createSupportCalculation?.client;

        if (type === 'create') {
          const queryVariables = {
            where: { clientId: { equals: client?.id } },
          };

          const calculations = apolloClient.readQuery({
            query: PREVIOUS_SUPPORT_CALCULATIONS,
            variables: queryVariables,
            skip: !client?.id,
          });

          apolloClient.writeQuery({
            query: PREVIOUS_SUPPORT_CALCULATIONS,
            data: {
              supportCalculations: [
                ...calculations?.supportCalculations,
                data?.createSupportCalculation,
              ],
            },
            variables: queryVariables,
            skip: !client?.id,
          });

          const path = `/${calculatorType === 'CHILD' ? 'child' : 'spousal'}-support/${
            data?.createSupportCalculation?.id
          }${isPro ? `/${calculationClient?.id}` : ''}`;

          push(path);
        }

        toast.success('Calculation has been successfully saved');
      })
      .catch(err => err.graphQLErrors?.map(({ message }) => toast.error(message)));
  }, [client, type, me, values, calculationId, mutate, push, calculatorType, isPro, apolloClient]);

  return (
    <div className='save-button-container'>
      <Button
        disabled={loading}
        size='lg'
        onClick={handleClick}
        leftIcon={loading ? 'spinner' : 'save'}
        spin={loading}
      >
        {loading ? 'Saving...' : 'Save'}
      </Button>
    </div>
  );
};

export default SaveCalculationButton;
