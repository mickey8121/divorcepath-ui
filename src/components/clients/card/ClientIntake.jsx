import React, { Fragment, useCallback, useMemo } from 'react';

import { useMutation } from '@apollo/client';
import { Form, FormikProvider, useFormik } from 'formik';
import sortBy from 'lodash/sortBy';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';

import CustomSelect from 'components/common/inputs/Select/SelectField';
import TextInput from 'components/common/inputs/TextInput';
import Button from 'components/common/Button';
import Notification from 'components/common/Notification';

import IntakeField from 'components/clients/card/IntakeField';

import useCurrentUser from 'hooks/useCurrentUser';
import useConfirm from 'hooks/useConfirm';
import useModal from 'hooks/useModal';

import getUserName from 'utils/getUserName';

import CLIENTS from 'graphql/queries/client/paginatedClients';
import UPDATE_CLIENT from 'graphql/mutations/clients/updateClient';
import CLIENTS_COUNT from 'graphql/queries/client/clientsCount';

const retainOptions = [
  {
    value: 'POTENTIAL',
    name: 'Potential Client',
  },
  {
    value: 'RETAINED',
    name: 'Retained',
  },
  {
    value: 'NOT_RETAINED',
    name: 'Not Retained',
  },
];

const ClientIntake = ({ client, setExpandedClient, isShow }) => {
  const { me } = useCurrentUser();

  const { open: openUpdateIntakeModal } = useModal('UPDATE_INTAKE');

  const { push } = useHistory();

  const [updateClient] = useMutation(UPDATE_CLIENT);

  const confirm = useConfirm({
    size: 'sm',
    title: 'Are you sure?',
    message:
      'This client will be saved to the database but will only be visible if specifically searched for.',
    negativeBtnLabel: 'Cancel',
    positiveBtnLabel: 'Confirm',
  });

  const { id, profile, professionals, type, intakeForm } = useMemo(() => client, [client]);

  const initialValues = useMemo(
    () => ({
      professionals:
        professionals?.map(pro => ({
          name: getUserName(pro) || pro?.profile?.email,
          label: getUserName(pro) || pro?.profile?.email,
          value: pro.id,
        })) || [],
      matter: profile.matter?.number || '',
      type,
    }),
    [professionals, profile, type],
  );

  const professionalOptions = useMemo(
    () =>
      me.professional?.organization?.members?.map(member => ({
        value: member.user.professional.id,
        name: `${member.user.professional.profile.firstName} ${member.user.professional.profile.lastName}`,
      })),
    [me],
  );

  const isRetained = useMemo(() => type === 'RETAINED', [type]);

  const formik = useFormik({
    validateOnMount: false,
    initialValues,
    enableReinitialize: true,
  });

  const { setFieldValue, values, setFieldError, setFieldTouched } = formik;

  const handleChangeProfessional = useCallback(
    value => {
      try {
        setFieldValue('professionals', value || []);

        const isEmpty = !value?.length;
        const proIds = value?.map(option => ({ id: option.value }));

        toast.promise(
          updateClient({
            variables: {
              data: { professionals: { set: proIds?.length ? proIds : [] } },
              where: { id },
            },
          }),
          {
            pending: `${isEmpty ? 'Una' : 'A'}ssigning professional`,
            success: `Professional ${isEmpty ? 'un' : ''}assigned`,
            error: `Professional not ${isEmpty ? 'un' : ''}assigned`,
          },
        );
      } catch (err) {
        setFieldValue('professionals', initialValues.professionals);
      }
    },
    [setFieldValue, updateClient, id, initialValues],
  );

  const handleChangeRetain = useCallback(
    async ({ value }) => {
      if (client?.type === value) return null;

      if (!values.professionals.length && value === 'RETAINED') {
        setFieldTouched('professionals');

        setTimeout(() => {
          setFieldError(
            'professionals',
            'Assign a professional so this client appears in their client list.',
          );
        }, 0);

        return toast.error('Please assign a professional');
      }

      try {
        const isTypeNotRetained = value === 'NOT_RETAINED';

        if (isTypeNotRetained) {
          const result = await confirm();

          if (!result) {
            setFieldValue('type', client?.type);

            return null;
          }
        }

        setFieldValue('type', value || client?.type);

        toast.promise(
          updateClient({
            variables: {
              data: { type: value },
              where: { id },
            },
            update: (cache, { data }) => {
              if (!data?.updateClient) return;

              const { updateClient: updatedClient } = data;

              try {
                let { paginatedClients } =
                  cache.readQuery({
                    query: CLIENTS,
                    variables: {
                      first: 10,
                      orderBy: [{ type: 'asc' }, { createdAt: 'desc' }],
                      where: { NOT: { type: { equals: 'NOT_RETAINED' } } },
                    },
                  }) || {};

                paginatedClients = {
                  ...paginatedClients,
                  nodes: sortBy(paginatedClients?.nodes, node => node.type) || [],
                };

                if (isTypeNotRetained) {
                  paginatedClients = {
                    ...paginatedClients,
                    nodes: paginatedClients?.nodes.filter(c => c?.id !== updatedClient?.id) || [],
                  };

                  cache.writeQuery({
                    query: CLIENTS_COUNT,
                    variables: { whereMany: [{ NOT: { type: { equals: 'NOT_RETAINED' } } }] },
                    data: { clientsCount: { counts: [paginatedClients?.count - 1] } },
                  });
                }

                cache.writeQuery({
                  query: CLIENTS,
                  variables: {
                    first: 10,
                    orderBy: [{ type: 'asc' }, { createdAt: 'desc' }],
                    where: { NOT: { type: { equals: 'NOT_RETAINED' } } },
                  },
                  data: {
                    paginatedClients: {
                      ...paginatedClients,
                      nodes: paginatedClients.nodes,
                    },
                  },
                });

                setExpandedClient(id);
              } catch {}
            },
          }),
          {
            pending: `Updating client status`,
            success: `Client status updated`,
            error: `Client status not updated`,
          },
        );
      } catch (err) {
        setFieldValue('professionals', initialValues.professionals);
      }
    },
    [
      client,
      values.professionals.length,
      setFieldValue,
      updateClient,
      id,
      confirm,
      setExpandedClient,
      initialValues.professionals,
      setFieldError,
      setFieldTouched,
    ],
  );

  const handleMatterInputBlur = useCallback(() => {
    if (!initialValues.matter && !values.matter) return null;

    const matterData = { number: values.matter };

    let matter = { upsert: { update: matterData, create: matterData } };
    let isDeleting = false;

    if (!values.matter) {
      matter = { delete: true };
      isDeleting = true;
    }

    return toast.promise(
      updateClient({
        variables: { data: { profile: { update: { matter } } }, where: { id } },
      }),
      {
        pending: `${isDeleting ? 'Deleting' : 'Assigning'} matter number`,
        success: `Matter number ${isDeleting ? 'deleted' : 'assigned'}`,
        error: `Matter number not ${isDeleting ? 'deleted' : 'assigned'}`,
      },
    );
  }, [id, initialValues, updateClient, values.matter]);

  const handleOpenModal = useCallback(() => {
    openUpdateIntakeModal({ client });
  }, [openUpdateIntakeModal, client]);

  const handleAddMatterNumberCLick = useCallback(() => {
    push({
      pathname: `/clients/${id}/edit/matter`,
      state: { fromClientList: true },
    });
  }, [id, push]);

  const professionalsName = useMemo(
    () => professionals?.map(pro => getUserName(pro) || pro?.profile?.email) || [],
    [professionals],
  );

  if (!isShow) return null;

  return (
    <div className='intake-info-container'>
      <Notification
        body={
          <p className='default-notification-text'>
            Detailed client profile information is in the profile tab. You can also send the client
            an{' '}
            <Button color='link' size='sm' onClick={() => open({ client })} className='noty-btn'>
              interview
            </Button>{' '}
            to complete their profile.
          </p>
        }
        name='detailed-client-profile'
        className='py-2'
        footer
      />

      <div className='intake-info-section'>
        <div className='left-title'>
          <span>Intake data:</span>
        </div>
        <div className='client-info-list intake'>
          <IntakeField value={intakeForm?.email} name='Email:' onClick={handleOpenModal} />
          <IntakeField value={intakeForm?.phone} name='Phone number:' onClick={handleOpenModal} />
          <IntakeField
            value={`${dayjs(intakeForm?.client?.createdAt || client?.createdAt).format(
              values.type === 'POTENTIAL' ? 'MMMM D, h:mm A' : 'MMMM D, YYYY',
            )}`}
            name='Submitted:'
            onClick={handleOpenModal}
          />
        </div>
      </div>
      <div className='intake-info-section'>
        <div className='left-title'>
          <span>Client inquiry:</span>
        </div>
        <div className='client-info-list intake'>
          <IntakeField
            value={intakeForm?.issue}
            name='Client inquiry:'
            onClick={handleOpenModal}
            bold={false}
          />
        </div>
      </div>
      <div className='intake-info-section'>
        <div className='left-title'>
          <span>Intake notes:</span>
        </div>
        <div className='client-info-list intake'>
          <IntakeField
            value={intakeForm?.notes}
            name='Intake notes:'
            onClick={handleOpenModal}
            bold={false}
          />

          <Button
            color='link'
            size='sm'
            rightIcon='edit'
            onClick={handleOpenModal}
            className='edit-intake-btn'
          >
            Edit intake data
          </Button>
        </div>
      </div>
      <div className='dashed-divider' />
      <div className='intake-info-section'>
        <div className='left-title' />
        <div className='client-info-list intake'>
          {isRetained ? (
            <Fragment>
              <IntakeField
                value={professionalsName.length && professionalsName.join(', ')}
                name='Professional:'
              />
              <IntakeField
                value={profile.matter?.number}
                name='Matter number:'
                onClick={handleAddMatterNumberCLick}
              />
              <IntakeField value='Retained' name='Status:' />
            </Fragment>
          ) : (
            <FormikProvider value={formik}>
              {!isRetained && (
                <Notification
                  body={
                    <p>
                      Update client status. To continue working with the client, change the status
                      to Retained. Changing the status to “Not Retained” will hide this profile
                      unless searched for.
                    </p>
                  }
                  name='client-status'
                  className='p-3'
                  footer
                />
              )}

              <Form className='assign-intake-form'>
                <CustomSelect
                  isMulti
                  size='md'
                  isClearable={false}
                  name='professionals'
                  className='multi-select'
                  containerClassName='mb-3'
                  options={professionalOptions}
                  onChange={handleChangeProfessional}
                  placeholder='Unassigned'
                  label='Assign a professional'
                />

                <TextInput
                  label='Matter number'
                  name='matter'
                  size='md'
                  placeholder='123 - 456 - 678'
                  containerClassName='w-100 mb-3'
                  onBlur={handleMatterInputBlur}
                />

                <CustomSelect
                  name='type'
                  size='md'
                  options={retainOptions}
                  onChange={handleChangeRetain}
                  placeholder='Unassigned'
                  label='Client Status'
                />
              </Form>
            </FormikProvider>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientIntake;
