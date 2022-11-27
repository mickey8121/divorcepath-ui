import React, { useCallback } from 'react';

import { useMutation, useApolloClient } from '@apollo/client';
import { toast } from 'react-toastify';
import { Formik } from 'formik';

import NewClientForm from 'components/clients/NewClientForm';

import useCurrentUser from 'hooks/useCurrentUser';
import useConfirm from 'hooks/useConfirm';
import useLazyQuery from 'hooks/useLazyQuery';

import { applyFilterToQuery, filters } from 'helpers/filters';

import { newClientSchema } from 'utils/schemas';
import generateClientsQuery from 'utils/generateClientsQuery';

import CREATE_CLIENT from 'graphql/mutations/clients/createClient';
import CLIENTS from 'graphql/queries/client/clients';
import PAGINATED_CLIENTS from 'graphql/queries/client/paginatedClients';
import CLIENTS_COUNT from 'graphql/queries/client/clientsCount';

const initialValues = {
  firstName: '',
  middleName: '',
  lastName: '',
  phone: '',
  email: '',
  legalIssue: '',
  notes: '',
};

const NewClientContainer = ({
  setToggleForm,
  toggleForm,
  setExpandedClient,
  handleSetSearchValue,
}) => {
  const client = useApolloClient();
  const [createClient, { loading }] = useMutation(CREATE_CLIENT);

  const refetchClients = useLazyQuery(CLIENTS);

  const getClientsCountByName = useLazyQuery(CLIENTS_COUNT);

  const confirm = useConfirm({
    size: 'sm',
    title: 'Create client?',
    message: 'There is already a client in the system with this name.',
    negativeBtnLabel: 'Create',
    positiveBtnLabel: 'Show existing client',
  });

  const { me } = useCurrentUser();
  const professionalId = me?.professional?.id;

  const handleSubmitForm = useCallback(
    async ({ firstName, lastName, middleName, email, phone, legalIssue, notes }, { resetForm }) => {
      if (!me.professional?.organization?.id) {
        return toast.error(
          'To create a new client you need to join the organization or create your own.',
        );
      }

      const intakeForm = {
        create: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          middleName: middleName?.trim() || null,
          phone: phone?.trim(),
          email: email?.trim(),
          issue: legalIssue?.trim(),
          notes: notes?.trim(),
        },
      };

      const variables = {
        data: {
          professionals: {
            connect: { id: me?.professional?.id },
          },
          organization: {
            connect: { id: me.professional?.organization?.id },
          },
          profile: {
            create: {
              firstName: firstName.trim(),
              lastName: lastName.trim(),
              middleName: middleName?.trim() || null,
              email: email?.trim(),
              phone: phone?.trim(),
            },
          },
          intakeForm: phone || email || legalIssue || notes ? intakeForm : undefined,
        },
      };

      const clientName = `${firstName.trim()} ${lastName.trim()}`.trim();

      const queryVariables = generateClientsQuery(clientName, ['firstName', 'lastName']);

      const clientsQuery = await getClientsCountByName({
        whereMany: [queryVariables],
      });

      if (clientsQuery?.data?.clientsCount?.counts[0] > 0) {
        if (await confirm()) {
          return handleSetSearchValue(clientName);
        }
      }

      createClient({ variables, refetchQueries: ['clientsCount'] })
        .then(({ data }) => {
          refetchClients({ variables: { where: { NOT: { type: { equals: 'NOT_RETAINED' } } } } });

          Object.keys(filters).forEach(filter => {
            const where = applyFilterToQuery(filter, { id: professionalId })({
              NOT: { type: { equals: 'NOT_RETAINED' } },
            });

            const clients = client.readQuery({
              query: PAGINATED_CLIENTS,
              variables: {
                first: 10,
                orderBy: [{ type: 'asc' }, { createdAt: 'desc' }],
                where,
              },
            });

            if (clients) {
              client.writeQuery({
                query: PAGINATED_CLIENTS,
                variables: {
                  first: 10,
                  orderBy: [{ type: 'asc' }, { createdAt: 'desc' }],
                  where,
                },
                data: {
                  paginatedClients: {
                    ...clients.paginatedClients,
                    count: clients.paginatedClients?.count + 1,
                    nodes: [data.createClient, ...clients.paginatedClients?.nodes],
                  },
                },
              });
            }
          });

          resetForm();
          setExpandedClient(data.createClient.id);
          setToggleForm(false);
        })
        .catch(err => err.graphQLErrors?.map(({ message }) => toast.error(message)));

      return null;
    },
    [
      me,
      createClient,
      client,
      setExpandedClient,
      setToggleForm,
      refetchClients,
      confirm,
      getClientsCountByName,
      handleSetSearchValue,
      professionalId,
    ],
  );

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={newClientSchema}
      onSubmit={handleSubmitForm}
      validateOnMount={false}
      validateOnBlur={false}
    >
      {({ handleSubmit }) => (
        <NewClientForm
          loading={loading}
          isOpen={toggleForm}
          formTitle='Add Client'
          onSubmit={handleSubmit}
        />
      )}
    </Formik>
  );
};

export default NewClientContainer;
