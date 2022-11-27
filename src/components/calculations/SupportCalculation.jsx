/* eslint-disable no-console */
import React, { useMemo, useCallback, useState, useEffect } from 'react';

import { useMutation, useApolloClient, useQuery } from '@apollo/client';
import { useHistory, useLocation } from 'react-router';
import { usePrevious } from 'react-delta';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { toast } from 'react-toastify';
import { FormikProvider, useFormik, Form } from 'formik';
import { Row, Col, Container } from 'reactstrap';
import { scroller } from 'react-scroll';
import classnames from 'classnames';

import CalculationToggleInput from 'components/calculations/components/common/CalculationToggleInput';
import SaveCalculationModal from 'components/modals/calculation/SaveCalculationModal';
import CreateNewClientModal from 'components/modals/client/CreateNewClientModal';

import BackgroundSection from 'components/calculations/sections/BackgroundSection';
import ChildrenSection from 'components/calculations/sections/ChildrenSection';
import IncomeSection from 'components/calculations/sections/IncomeSection';
import TaxBenefitsSection from 'components/calculations/sections/TaxBenefitsSection';
import SupportReportContainer from 'components/calculations/SupportReportContainer';
import Sidebar from 'components/calculations/sidebar/Sidebar';
import CalculationSection from 'components/calculations/sections/CalculationSection';
import difference from 'components/calculations/utils/difference';
import loadInitialValues from 'components/calculations/utils/loadInitialValues';
import validationSchema from 'components/calculations/utils/validationSchema';
import ShareCalculationForm from 'components/calculations/shareCalculation/ShareCalculationForm';
import SaveSharedCalculation from 'components/calculations/shareCalculation/SaveSharedCalculation';

import useCalculationContext from 'hooks/useCalculationContext';
import useCurrentUser from 'hooks/useCurrentUser';
import useModal from 'hooks/useModal';

import getProfileName from 'utils/getProfileName';
import getSerializedFormValues from 'utils/getSerializedFormValues';
import compareStrings from 'utils/compareStrings';

import CLIENTS from 'graphql/queries/client/clients';
import CLIENT_FRAGMENT from 'graphql/fragments/client';
import PAGINATED_CLIENTS from 'graphql/queries/client/paginatedClients';
import CREATE_SUPPORT_CALCULATION from 'graphql/mutations/calculations/createSupportCalculation';
import GET_PDF from 'graphql/queries/calculations/getPDF';
import START_FREE_SUPPORT_CALCULATION from 'graphql/mutations/calculations/startFreeSupportCalculation';
import SUPPORT_CALCULATION from 'graphql/queries/calculations/supportCalculaton';
import UPDATE_SUPPORT_CALCULATION from 'graphql/mutations/calculations/updateSupportCalculation';
import UPDATE_CLIENT from 'graphql/mutations/clients/updateClient';
import SHARED_SUPPORT_CALCULATION from 'graphql/queries/calculations/sharedSupportCalculation';

const SupportCalculation = () => {
  const {
    supportCalculation,
    supportCalculationLoading,
    calculationId,
    type,
    calculatorType,
    isSubscriptionActive,
    client,
    isProfessional,
    isSharedCalculation,
  } = useCalculationContext();

  const history = useHistory();
  const { state, hash } = useLocation();
  const apolloClient = useApolloClient();
  const { me } = useCurrentUser();

  const { data: { sharedSupportCalculation } = {}, loading: loadingSharedCalculation } = useQuery(
    SHARED_SUPPORT_CALCULATION,
    {
      variables: { where: { id: calculationId } },
      skip: !calculationId || !isSharedCalculation,
      errorPolicy: 'all',
    },
  );

  const { data: { clients } = {} } = useQuery(CLIENTS, {
    skip: !isProfessional,
  });

  const { open: openSaveModal } = useModal('SAVE_CALCULATION');

  const [isChanged, setIsChanged] = useState(false);
  const prevIsChanged = usePrevious(isChanged);
  const [disposableCalc, setDisposableCalc] = useState(null);

  // Defines if client can request report right now or now
  // It changes when he updated the form, but didn't request a new calculation yet
  const [isReportAvailable, setIsReportAvailable] = useState(true);

  const [mutate, { loading }] = useMutation(
    type === 'create' ? CREATE_SUPPORT_CALCULATION : UPDATE_SUPPORT_CALCULATION,
  );
  const [updateClient] = useMutation(UPDATE_CLIENT);
  const [createDisposableCalc, { loading: disposableCalcLoading }] = useMutation(
    START_FREE_SUPPORT_CALCULATION,
  );

  const clientId = useMemo(() => client?.id, [client]);

  const clientName = useMemo(() => getProfileName(client?.profile), [client]);

  const hasChildren = useMemo(
    () => me?.client?.children?.length > 0 || client?.children?.length > 0,
    [client, me],
  );

  const showSpousalSupport = useMemo(() => {
    if (calculatorType === 'SPOUSAL') return true;
    return supportCalculation?.showSpousalSupport || false;
  }, [supportCalculation, calculatorType]);

  const showChildSupport = useMemo(() => {
    if (calculatorType === 'CHILD') return true;
    if (type === 'create') return hasChildren || !!state?.hasChildren;

    return [undefined, null].includes(supportCalculation?.showChildSupport)
      ? true
      : supportCalculation?.showChildSupport;
  }, [supportCalculation, hasChildren, calculatorType, state, type]);

  const initialValues = useMemo(
    () =>
      loadInitialValues({
        calculatorType,
        client,
        isSubscriptionActive,
        me,
        showChildSupport,
        supportCalculation,
        type,
        hasChildren,
        isProfessional,
      }),
    [
      calculatorType,
      client,
      isSubscriptionActive,
      me,
      showChildSupport,
      hasChildren,
      supportCalculation,
      type,
      isProfessional,
    ],
  );
  const handleSubmitForm = useCallback(
    (values, { setSubmitting, setValues }) => {
      setSubmitting(true);

      const clientFirstName = values?.clientSupportProfile?.firstName;
      const exFirstName = values?.exSupportProfile?.firstName;

      const isDefaultProfile = !clientId && clientFirstName === 'Client' && exFirstName === 'Ex';

      const variables = {
        data: values,
      };

      if (clientId) {
        variables.data.client = {
          connect: {
            id: clientId,
          },
        };
      } else if (!isDefaultProfile) {
        variables.data.client = {
          create: {
            organization: {
              connect: {
                id: me?.professional?.organization?.id,
              },
            },
            professionals: {
              connect: [
                {
                  id: me?.professional?.id,
                },
              ],
            },
            profile: {
              create: {
                firstName: values?.clientSupportProfile?.create?.firstName,
                middleName: values?.clientSupportProfile?.create?.middleName,
                lastName: values?.clientSupportProfile?.create?.lastName,
              },
            },
          },
        };
      }

      if (type === 'update') {
        variables.where = { id: calculationId };
      }

      const serializedVariables = getSerializedFormValues(variables);

      const mutation = isDefaultProfile ? createDisposableCalc : mutate;

      mutation({ variables: serializedVariables })
        .then(({ data }) => {
          setIsReportAvailable(true);
          setIsChanged(false);

          if (isDefaultProfile) {
            const newValues = loadInitialValues({
              isProfessional,
              type,
              client,
              supportCalculation: data?.startFreeSupportCalculation,
              isSubscriptionActive,
              showChildSupport: data?.startFreeSupportCalculation?.showChildSupport,
              calculatorType,
              me,
            });

            setValues(
              {
                ...values,
                clientSupportProfile: {
                  ...values.clientSupportProfile,
                  federalBenefits: newValues?.clientSupportProfile?.federalBenefits,
                  federalCredits: newValues?.clientSupportProfile?.federalCredits,
                  federalDeductions: newValues?.clientSupportProfile?.federalDeductions,

                  provincialBenefits: newValues?.clientSupportProfile?.provincialBenefits,
                  provincialCredits: newValues?.clientSupportProfile?.provincialCredits,
                  provincialDeductions: newValues?.clientSupportProfile?.provincialDeductions,
                },
                exSupportProfile: {
                  ...values.exSupportProfile,
                  federalBenefits: newValues?.exSupportProfile?.federalBenefits,
                  federalCredits: newValues?.exSupportProfile?.federalCredits,
                  federalDeductions: newValues?.exSupportProfile?.federalDeductions,

                  provincialBenefits: newValues?.exSupportProfile?.provincialBenefits,
                  provincialCredits: newValues?.exSupportProfile?.provincialCredits,
                  provincialDeductions: newValues?.exSupportProfile?.provincialDeductions,
                },
                // calculationResult: data?.startFreeSupportCalculation?.calculationResult
              },
              false,
            );

            setDisposableCalc({
              ...newValues,
              calculationResult: data?.startFreeSupportCalculation?.calculationResult,
            });
          }

          if (type === 'update') {
            const cachedCalculationQuery = apolloClient.readQuery({
              query: SUPPORT_CALCULATION,
              variables: {
                where: {
                  id: calculationId,
                },
              },
            });

            apolloClient.writeQuery({
              query: SUPPORT_CALCULATION,
              variables: {
                where: {
                  id: calculationId,
                },
              },
              data: {
                supportCalculation: {
                  ...cachedCalculationQuery.supportCalculation,
                  calculationResult: get(
                    cachedCalculationQuery,
                    'supportCalculation.calculationResult',
                    null,
                  ),
                },
              },
            });
          }

          if (!isDefaultProfile) {
            // Resetting any possible getPDF results in cache
            // TODO: pull reportTypes from constants or cache
            if (calculationId) {
              try {
                ['DETAILED', 'CONDENSED'].map(reportType =>
                  apolloClient.writeQuery({
                    query: GET_PDF,
                    variables: {
                      data: {
                        supportCalculationId: calculationId,
                        reportType,
                      },
                    },
                    data: {
                      getPDF: {
                        pdfUrl: null,
                      },
                    },
                  }),
                );
              } catch (error) {
                console.log(error.message);
              }
            }

            const calculationClient = data?.createSupportCalculation?.client;

            if (calculationClient && isProfessional) {
              const variablesData = {
                where: {
                  professionals: {
                    some: {
                      id: {
                        equals: me?.professional?.id,
                      },
                    },
                  },
                },
              };

              try {
                const { paginatedClients } =
                  apolloClient.readQuery({
                    skip: !isProfessional,
                    query: CLIENTS,
                    variables: variablesData,
                  }) || {};

                apolloClient.writeQuery({
                  skip: !isProfessional,
                  query: CLIENTS,
                  variables: variablesData,
                  data: {
                    paginatedClients: {
                      ...paginatedClients,
                      nodes: [
                        ...paginatedClients?.nodes?.filter(
                          ({ id }) => id !== calculationClient?.id,
                        ),
                        calculationClient,
                      ],
                    },
                  },
                });
              } catch (error) {
                console.error(error.message);
              }
            }

            if (type === 'create' && !isDefaultProfile) {
              try {
                let cacheClient;

                try {
                  cacheClient = apolloClient.readFragment({
                    id: `Client:${clientId}`,
                    fragment: CLIENT_FRAGMENT,
                    fragmentName: 'CLIENT_FRAGMENT',
                  });
                } catch (error) {}

                apolloClient.writeFragment({
                  id: `Client:${clientId}`,
                  fragment: CLIENT_FRAGMENT,
                  fragmentName: 'CLIENT_FRAGMENT',
                  data: {
                    ...cacheClient,
                    supportCalculations: [
                      ...cacheClient?.supportCalculations,
                      data?.createSupportCalculation,
                    ],
                  },
                });
              } catch (e) {
                console.log(e);
              }

              if (variables?.data?.client?.create?.professionals?.connect) {
                try {
                  const clients = apolloClient.readQuery({
                    query: CLIENTS,
                    variables: { where: { NOT: { type: { equals: 'NOT_RETAINED' } } } },
                  });

                  apolloClient.writeQuery({
                    query: CLIENTS,
                    variables: { where: { NOT: { type: { equals: 'NOT_RETAINED' } } } },
                    data: {
                      clients: [...clients.clients, data.createClient],
                    },
                  });
                } catch {}

                try {
                  const paginatedClients = apolloClient.readQuery({
                    query: PAGINATED_CLIENTS,
                    variables: {
                      first: 10,
                      orderBy: { createdAt: 'asc' },
                      where: { NOT: { type: { equals: 'NOT_RETAINED' } } },
                    },
                  });

                  apolloClient.writeQuery({
                    query: PAGINATED_CLIENTS,
                    variables: {
                      first: 10,
                      orderBy: { createdAt: 'asc' },
                      where: { NOT: { type: { equals: 'NOT_RETAINED' } } },
                    },
                    data: {
                      paginatedClients: {
                        ...paginatedClients.paginatedClients,
                        count: paginatedClients.paginatedClients?.count + 1,
                        nodes: [
                          ...paginatedClients.paginatedClients?.nodes,
                          data?.createSupportCalculation?.client,
                        ],
                      },
                    },
                  });
                } catch (e) {
                  console.log(e);
                }
              }

              const path = `/${calculatorType === 'CHILD' ? 'child' : 'spousal'}-support/${
                data?.createSupportCalculation?.id
              }${isProfessional ? `/${calculationClient?.id || ''}` : ''}`;

              history.push(path);
            }
          }
        })
        .then(() => {
          setIsChanged(false);

          scroller.scrollTo('results', {
            duration: 2000,
            delay: 500,
            smooth: 'easeInOutQuart',
            ignoreCancelEvents: true,
          });

          if (!isDefaultProfile && clientId) {
            const residenceDifference = difference(
              {
                address: { update: { residence: values.clientSupportProfile?.residence } },
                exAddress: { update: { residence: values.exSupportProfile?.residence } },
              },
              {
                address: { update: { residence: client?.address.residence } },
                exAddress: { update: { residence: client?.exAddress.residence } },
              },
            );

            if (!isEmpty(residenceDifference)) {
              updateClient({ variables: { data: residenceDifference, where: { id: clientId } } });
            }
          }
        })
        .catch(err => err.graphQLErrors?.map(({ message }) => toast.error(message)))
        .finally(() => setSubmitting(false));
    },
    [
      clientId,
      type,
      client,
      createDisposableCalc,
      mutate,
      updateClient,
      me,
      calculationId,
      isProfessional,
      isSubscriptionActive,
      calculatorType,
      apolloClient,
      history,
    ],
  );

  const calculation = useMemo(() => {
    if (!clientId) return disposableCalc;

    return supportCalculation;
  }, [clientId, supportCalculation, disposableCalc]);

  const showTaxes = useMemo(() => type === 'update' || disposableCalc, [type, disposableCalc]);

  const formik = useFormik({
    // This is commented out, because it was resulting in formik reset state
    // to initial values when do any mutation like adding new income
    // We added preloader so now we load the form only once
    // So don't need to reinitialize it
    // enableReinitialize: true,
    initialValues,
    validationSchema: validationSchema(calculatorType),
    onSubmit: handleSubmitForm,
    enableReinitialize: true,
  });

  const {
    handleSubmit,
    isSubmitting,
    setSubmitting,
    initialValues: formikInitialValues,
    resetForm,
  } = formik;

  const handleFocus = event => {
    event.preventDefault();
    event.stopPropagation();
    resetForm();

    openSaveModal();
  };

  useEffect(() => {
    setSubmitting(supportCalculationLoading);
  }, [setSubmitting, supportCalculationLoading]);

  useEffect(() => {
    if (hash) {
      scroller.scrollTo(hash, {
        duration: 1000,
        delay: 200,
        smooth: 'easeInOutQuart',
        isDynamic: true,
      });
    }
  }, [hash]);

  useEffect(() => {
    // If user has changed something on a form we disable a reports for him
    // until he recalculates or reload the page
    if (!prevIsChanged && isChanged) {
      setIsReportAvailable(false);
    }
  }, [prevIsChanged, isChanged, setIsReportAvailable]);

  const foundedClient = clients?.find(client => {
    return (
      compareStrings(
        client.profile.firstName,
        sharedSupportCalculation?.clientSupportProfile.firstName,
      ) &&
      compareStrings(
        client.profile.lastName,
        sharedSupportCalculation?.clientSupportProfile.lastName,
      )
    );
  });

  const sharedBy = sharedSupportCalculation?.share?.sharedBy;

  return (
    <React.Fragment>
      <CreateNewClientModal />

      <FormikProvider value={formik}>
        <Form onSubmit={handleSubmit} onFocus={e => isSharedCalculation && handleFocus(e)}>
          <Container>
            <Row>
              <Col
                md={8}
                lg={9}
                className={classnames('col-11 calculator-main filled pl-3 overflow-hidden', {
                  loading: isSubmitting,
                })}
              >
                <SaveCalculationModal client={me.client ? me.client : foundedClient} />

                {isSharedCalculation && (
                  <SaveSharedCalculation
                    calculationId={calculationId}
                    clientId={clientId}
                    client={me.client ? me.client : foundedClient}
                    sharedBy={sharedBy}
                    loading={loadingSharedCalculation}
                  />
                )}

                {!me?.id && <CalculationToggleInput />}
                <CalculationSection
                  clientId={clientId}
                  clientName={clientName}
                  handleSubmit={handleSubmit}
                  initialValues={formikInitialValues}
                />
                <BackgroundSection clientId={clientId} />
                <ChildrenSection />
                <IncomeSection showChildSupportResults={showChildSupport} />
                <TaxBenefitsSection
                  supportCalculation={calculation}
                  showSpousalSupport={showSpousalSupport}
                />

                <SupportReportContainer
                  showTaxes={showTaxes}
                  isChanged={isChanged}
                  calculation={calculation}
                  mutationLoading={loading || disposableCalcLoading}
                  isReportAvailable={isReportAvailable}
                  setIsReportAvailable={setIsReportAvailable}
                  loading={loading || disposableCalcLoading}
                  setIsChanged={setIsChanged}
                  handleSubmit={handleSubmit}
                />
              </Col>

              <Col md={4} lg={3} className='pl-0 pr-1 calculator-sidebar col-1'>
                <Sidebar
                  showTaxes={showTaxes}
                  supportCalculation={calculation}
                  updatedAt={supportCalculation?.updatedAt}
                  isSubmitting={isSubmitting || supportCalculationLoading}
                  queryLoading={supportCalculationLoading}
                  loading={loading || disposableCalcLoading}
                  setIsChanged={setIsChanged}
                  isChanged={isChanged}
                />
              </Col>
            </Row>
          </Container>
        </Form>
      </FormikProvider>

      {calculation?.calculationResult?.spousalSupport && !isSharedCalculation && calculationId && (
        <Container className='mt-n5'>
          <Row>
            <Col
              md={8}
              lg={9}
              className='col-11 calculator-main filled pl-3 overflow-hidden col-md-8 col-lg-9 mt-0'
            >
              <ShareCalculationForm
                calculationId={calculationId}
                sharedWith={supportCalculation?.shares}
                loading={supportCalculationLoading}
                inCalculator
              />
            </Col>
          </Row>
        </Container>
      )}
    </React.Fragment>
  );
};

export default SupportCalculation;
