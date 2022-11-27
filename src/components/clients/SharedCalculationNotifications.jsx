import React, { useMemo, useState, useEffect, useCallback } from 'react';

import { Collapse, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';

import Button from 'components/common/Button';
import Select from 'components/common/inputs/Select/Select';
import Icon from 'components/common/Icon';

import useCurrentUser from 'hooks/useCurrentUser';
import useModal from 'hooks/useModal';

import getProfileName from 'utils/getProfileName';
import getAge from 'utils/getAge';
import compareStrings from 'utils/compareStrings';
import getUserName from 'utils/getUserName';

import CLIENTS from 'graphql/queries/client/clients';
import DUPLICATE_SUPPORT_CALCULATION from 'graphql/mutations/calculations/duplicateSupportCalculation';
import SHARED_SUPPORT_CALCULATIONS from 'graphql/queries/calculations/sharedSupportCalculations';
import CHANGE_SHARE_SUPPORT_CALCULATION from 'graphql/mutations/calculations/changeShareSupportCalculation';
import PREVIOUS_SUPPORT_CALCULATIONS from 'graphql/queries/calculations/previousSuppportCalculations';

const getGenderShort = gender => (gender === 'MALE' ? 'M' : 'F');

const SharedCalculationNotifications = () => {
  const { data: dataClients, loading: clientsLoading } = useQuery(CLIENTS);
  const { data: { sharedSupportCalculations } = [], loading: calculationsLoading } = useQuery(
    SHARED_SUPPORT_CALCULATIONS,
  );

  if (clientsLoading || calculationsLoading) return null;

  return (
    <div className='shared-calculation-notifications'>
      {sharedSupportCalculations?.map(
        ({ clientSupportProfile, exSupportProfile, id, share: { sharedBy } }) => (
          <SharedCalculationNotification
            key={id}
            calculationId={id}
            client={{ profile: clientSupportProfile, exProfile: exSupportProfile }}
            sharedBy={sharedBy}
            data={dataClients}
          />
        ),
      )}
    </div>
  );
};

const SharedCalculationNotification = ({ client, sharedBy, data, calculationId }) => {
  const apolloClient = useApolloClient();

  const [deleteNotification, { loading: deleteLoading }] = useMutation(
    CHANGE_SHARE_SUPPORT_CALCULATION,
  );

  const { open: createNewClient, close: closeCreateNewClientModal } = useModal('CREATE_NEW_CLIENT');

  const { me } = useCurrentUser();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [duplicateSupportCalculation, { loading }] = useMutation(DUPLICATE_SUPPORT_CALCULATION, {
    fetchPolicy: 'network-only',
  });

  const sharedClient = client;

  const sharedByName = getUserName(sharedBy) || '';
  const sharedClientName = getProfileName(sharedClient?.profile) || '';
  const sharedClientExName = getProfileName(sharedClient.exProfile) || '';
  const sharedClientResidence = sharedClient?.address?.residence || 'Unknown';
  const sharedExResidence = sharedClient?.exAddress?.residence || 'Unknown';
  const clientAge = getAge(sharedClient?.profile?.birthDate) || 0;
  const clientExAge = getAge(sharedClient?.exProfile?.birthDate) || 0;
  const clientSex = getGenderShort(sharedClient?.profile?.gender) || '';
  const clientExSex = getGenderShort(sharedClient?.exProfile?.gender) || '';

  const options = useMemo(() => {
    const clients = data?.clients?.map(client => {
      const clientName = getProfileName(client?.profile);
      const { id } = client;

      return {
        label: clientName,
        value: id,
      };
    });

    clients?.unshift({ label: 'New client', value: 'new' });

    return clients;
  }, [data]);

  const activeOption = useMemo(
    () =>
      options?.find(
        ({ label }) =>
          compareStrings(label, sharedClientName) || compareStrings(label, sharedClientExName),
      ),
    [options, sharedClientExName, sharedClientName],
  );

  const defaultValue = useMemo(() => {
    return activeOption || { label: 'New client', value: 'new' };
  }, [activeOption]);

  const [selectedClient, setSelectedClient] = useState(defaultValue);

  useEffect(() => {
    if (activeOption) {
      setSelectedClient(activeOption);
    }
  }, [activeOption]);

  const changeHandler = newValue => {
    setSelectedClient(newValue);
  };

  const deleteHandler = useCallback(
    withSave => {
      deleteNotification({
        variables: {
          data: {
            email: me.email,
            supportCalculationId: calculationId,
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
                  sharedNotification => sharedNotification.id !== calculationId,
                ),
              },
            });
          } catch (error) {
            toast.error(error.message);
          }
        },
      })
        .then(() => {
          if (!withSave) toast.success(`Shared calculation by ${sharedClientName} was deleted`);
        })
        .catch(err => err.graphQLErrors.map(({ message }) => toast.error(message)));
    },
    [calculationId, deleteNotification, me, sharedClientName],
  );

  const onSubmit = useCallback(
    ({ client: clientId }) => {
      if (!clientId || clientId === 'new') {
        createNewClient({ calculationId }).then(() => {
          closeCreateNewClientModal();
        });
      }

      if (clientId) {
        duplicateSupportCalculation({
          variables: {
            data: {
              supportCalculationId: calculationId,
              clientId,
            },
          },
          update: (
            cache,
            {
              data: {
                duplicateSupportCalculation: { calculation },
              },
            },
          ) => {
            try {
              const { clients } = cache.readQuery({
                query: CLIENTS,
              });

              const selectedClient = clients.find(client => client.id === clientId);

              const updatedClient = {
                ...selectedClient,
                supportCalculations: selectedClient.supportCalculations,
              };

              cache.writeQuery({
                query: CLIENTS,
                data: {
                  clients: [
                    ...clients.map(client => {
                      if (client.id === clientId) {
                        return updatedClient;
                      }
                      return client;
                    }),
                  ],
                },
              });

              const cachedData = apolloClient.readQuery({
                query: PREVIOUS_SUPPORT_CALCULATIONS,
                variables: { where: { clientId: { equals: clientId } } },
                skip: !clientId,
              });

              const data = cachedData
                ? {
                    ...cachedData,
                    supportCalculations: [...cachedData?.supportCalculations, calculation],
                  }
                : { supportCalculations: [calculation] };

              apolloClient.writeQuery({
                query: PREVIOUS_SUPPORT_CALCULATIONS,
                variables: { where: { clientId: { equals: clientId } } },
                data,
              });
            } catch (error) {
              toast.error(error.message);
            }
          },
        })
          .then(() => {
            toast.success(`Calculation saved to ${selectedClient.label}`);
            deleteHandler(true);
          })
          .catch(err => err.graphQLErrors.map(({ message }) => toast.error(message)));
      }
    },
    [
      apolloClient,
      calculationId,
      closeCreateNewClientModal,
      createNewClient,
      deleteHandler,
      duplicateSupportCalculation,
      selectedClient.label,
    ],
  );

  const formik = useFormik({
    initialValues: {
      client: selectedClient.value,
    },
    onSubmit,
    validateOnBlur: false,
    validateOnChange: true,
    enableReinitialize: true,
  });

  const handleOpenDetails = () => {
    setDetailsOpen(!detailsOpen);
  };

  const { handleSubmit } = formik;

  return (
    <div className='d-flex align-items-flex-start mb-4 mx-3 flex-column justify-content-between shared-calculation-notification'>
      <Row className='container-fluid m-0 p-0'>
        <div className='container-fluid header d-flex p-3 mx-0' onClick={handleOpenDetails}>
          <div className='header-title'>
            <Icon name='calculator' className='calc-icon' height='20' width='20' />

            <span className='pl-0 shared-calculation-notification-text'>
              {`${sharedByName} shared a support calculation with you. Click to view.`}
            </span>
          </div>

          <div className='card-heading' onClick={handleOpenDetails}>
            <Icon name={`arrow-${detailsOpen ? 'up' : 'down'}`} className='collapse-icon' />
          </div>
        </div>

        <Col md={12} className='p-0'>
          <Collapse className='pl-0 shared-calculation-info' isOpen={detailsOpen}>
            <div className='border-top' />

            <div className='client-info pl-4 pt-3'>
              <Row className='mb-2'>
                <Col>
                  <span className='text-muted client-label'>Client name:</span>
                  <span className='shared-clients'>{`${sharedClientName} (${clientSex} / ${clientAge} / ${sharedClientResidence})`}</span>
                </Col>
              </Row>

              {sharedClientExName.length > 0 && (
                <Row>
                  <Col>
                    <span className='text-muted client-label'>Ex name:</span>
                    <span className='shared-clients'>{`${sharedClientExName} (${clientExSex} / ${clientExAge} / ${sharedExResidence})`}</span>
                  </Col>
                </Row>
              )}
            </div>

            <FormikProvider value={formik}>
              <Form onSubmit={handleSubmit} noValidate>
                <div className='save-client-form my-3 px-4'>
                  <Row className='mb-2'>
                    <Col>
                      <span className='label-form'>Save to Client</span>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Select
                        onChange={changeHandler}
                        value={selectedClient.value}
                        options={options}
                      />
                    </Col>
                  </Row>
                </div>

                <div className='border-top' />

                <Row>
                  <Col md={12}>
                    <div className='button-form-group d-flex align-items-center px-4 py-3'>
                      <Button
                        className='save-shared-calculation'
                        type='submit'
                        disabled={loading}
                        loading={loading}
                      >
                        Save
                      </Button>

                      <Link to={`/shared-calculation/${calculationId}`}>View without saving</Link>

                      <Button
                        size='sm'
                        color='red-link'
                        onClick={deleteHandler}
                        loading={deleteLoading}
                        disabled={deleteLoading}
                        className='delete-shared-calculation'
                        leftIcon='trash'
                      >
                        Delete
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </FormikProvider>
          </Collapse>
        </Col>
      </Row>
    </div>
  );
};

export default SharedCalculationNotifications;
