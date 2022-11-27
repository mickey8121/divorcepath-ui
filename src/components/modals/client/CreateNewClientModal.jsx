import React, { memo, useCallback, useMemo } from 'react';

import { useHistory, useLocation } from 'react-router';
import { Col, Row } from 'reactstrap';
import { Form, FormikProvider, useFormik } from 'formik';
import { useApolloClient, useLazyQuery, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';

import Modal from 'components/common/Modal';
import TextInput from 'components/common/inputs/TextInput';
import TextAreaComponent from 'components/common/inputs/TextAreaInput';

import useCurrentUser from 'hooks/useCurrentUser';
import useModal from 'hooks/useModal';

import { applyFilterToQuery, filters } from 'helpers/filters';

import { newClientSchema } from 'utils/schemas';
import getProfileName from 'utils/getProfileName';

import CREATE_CLIENT from 'graphql/mutations/clients/createClient';
import PAGINATED_CLIENTS from 'graphql/queries/client/paginatedClients';
import DUPLICATE_SUPPORT_CALCULATION from 'graphql/mutations/calculations/duplicateSupportCalculation';
import CLIENTS from 'graphql/queries/client/clients';
import CHANGE_SHARE_SUPPORT_CALCULATION from 'graphql/mutations/calculations/changeShareSupportCalculation';
import SHARED_SUPPORT_CALCULATIONS from 'graphql/queries/calculations/sharedSupportCalculations';
import PREVIOUS_SUPPORT_CALCULATIONS from 'graphql/queries/calculations/previousSuppportCalculations';

const initialValues = {
  firstName: '',
  middleName: '',
  lastName: '',
  phone: '',
  email: '',
  legalIssue: '',
};

const CreateNewClientModal = () => {
  const loc = useLocation();
  const { push } = useHistory();
  const apolloClient = useApolloClient();
  const [duplicateSupportCalculation] = useMutation(DUPLICATE_SUPPORT_CALCULATION);

  const isSharedCalculation = useMemo(
    () => loc.pathname.includes('shared-calculation'),
    [loc.pathname],
  );

  const [refetchClients] = useLazyQuery(CLIENTS);

  const [deleteNotification] = useMutation(CHANGE_SHARE_SUPPORT_CALCULATION);

  const [createClient, { loading }] = useMutation(CREATE_CLIENT);
  const client = useApolloClient();
  const { close, options, setLoading } = useModal('CREATE_NEW_CLIENT');
  const { close: closeSaveModal } = useModal('SAVE_CALCULATION');

  const { me } = useCurrentUser();
  const professionalId = me?.professional?.id;

  const createClientHandler = useCallback(
    (firstName, middleName, lastName, phone, email, legalIssue, notes) => {
      setLoading(true);

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
          intakeForm: {
            create: {
              firstName: firstName.trim(),
              lastName: lastName.trim(),
              middleName: middleName?.trim() || null,
              phone: phone?.trim(),
              email: email?.trim(),
              issue: legalIssue?.trim(),
              notes: notes?.trim(),
            },
          },
        },
      };

      createClient({ variables, refetchQueries: ['clientsCount'] }).then(({ data }) => {
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

        try {
          duplicateSupportCalculation({
            variables: {
              data: {
                supportCalculationId: options?.calculationId,
                clientId: data?.createClient.id,
              },
            },
            update: (
              _,
              {
                data: {
                  duplicateSupportCalculation: { calculation },
                },
              },
            ) => {
              apolloClient.writeQuery({
                query: PREVIOUS_SUPPORT_CALCULATIONS,
                variables: { where: { clientId: { equals: data?.createClient.id } } },
                data: {
                  ...data?.createClient,
                  supportCalculations: [...data?.createClient.supportCalculations, calculation],
                },
              });
            },
          }).then(() => {
            deleteNotification({
              variables: {
                data: {
                  email: me.email,
                  supportCalculationId: options.calculationId,
                },
              },
              update: cache => {
                try {
                  const { sharedSupportCalculations } = cache.readQuery({
                    query: SHARED_SUPPORT_CALCULATIONS,
                  });

                  cache.writeQuery({
                    query: SHARED_SUPPORT_CALCULATIONS,
                    data: {
                      sharedSupportCalculations: sharedSupportCalculations.filter(
                        sharedNotification => sharedNotification.id !== options.calculationId,
                      ),
                    },
                  });
                } catch (error) {}
              },
            }).then(() => {
              setLoading(false);

              if (isSharedCalculation) {
                push('/');
              }
            });
          });

          setLoading(false);
          close();
          closeSaveModal();
        } catch {}
        toast.success(
          `Calculation saved to new client ${getProfileName(data?.createclient?.profile)}`,
        );
      });
      return null;
    },
    [
      setLoading,
      me.professional?.id,
      me.professional?.organization?.id,
      me.email,
      createClient,
      duplicateSupportCalculation,
      options?.calculationId,
      close,
      closeSaveModal,
      refetchClients,
      apolloClient,
      deleteNotification,
      isSharedCalculation,
      push,
      professionalId,
      client,
    ],
  );

  const formik = useFormik({
    initialValues,
    validationSchema: newClientSchema,
    onSubmit: ({ firstName, middleName, lastName, phone, email, legalIssue, notes }) =>
      createClientHandler(firstName, middleName, lastName, phone, email, legalIssue, notes),
    validateOnMount: false,
    validateOnBlur: false,
    enableReinitialize: true,
  });

  const { handleSubmit } = formik;

  return (
    <Modal
      autoFocus={false}
      titleComponent='New Client'
      size='md'
      name='CREATE_NEW_CLIENT'
      form='CREATE_NEW_CLIENT'
      borderedHeader={false}
      submitButtonTitle='Confirm'
      cancelBtnTitle='Cancel'
      returnFocusAfterClose={false}
      scrollable
      zIndex='4000'
    >
      <FormikProvider value={formik}>
        <Form id='CREATE_NEW_CLIENT' onSubmit={handleSubmit}>
          <Col className='d-flex flex-column p-0'>
            <Row>
              <Col md={12}>
                <TextInput
                  name='firstName'
                  placeholder='Josh'
                  label='First Name'
                  disabled={loading}
                />
              </Col>

              <Col md={12}>
                <TextInput
                  name='middleName'
                  placeholder='Name'
                  label='Middle Name'
                  disabled={loading}
                />
              </Col>

              <Col md={12}>
                <TextInput
                  name='lastName'
                  placeholder='Frease'
                  label='Last Name'
                  disabled={loading}
                />
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <TextInput
                  name='phone'
                  placeholder='+1 (123) - 456 - 7890'
                  label='Phone number (optional)'
                  disabled={loading}
                />
              </Col>

              <Col md={12}>
                <TextInput
                  name='email'
                  placeholder='name@example.com'
                  label='Email (optional)'
                  disabled={loading}
                />
              </Col>
            </Row>

            <Row>
              <Col>
                <TextAreaComponent
                  name='legalIssue'
                  placeholder='Text'
                  label='Client inquiry (optional)'
                  disabled={loading}
                />
              </Col>
            </Row>

            <Row>
              <Col>
                <TextAreaComponent
                  name='notes'
                  placeholder='Text'
                  label='Intake notes (optional)'
                  disabled={loading}
                />
              </Col>
            </Row>
          </Col>
        </Form>
      </FormikProvider>
    </Modal>
  );
};

export default memo(CreateNewClientModal);
