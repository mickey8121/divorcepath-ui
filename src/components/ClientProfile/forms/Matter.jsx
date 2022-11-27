import React, { useCallback, useMemo, Fragment } from 'react';

import { Form, FormikProvider, useFormik } from 'formik';
import { toast } from 'react-toastify';
import { Row, Col } from 'reactstrap';

import TextInput from 'components/common/inputs/TextInput';
import TextAreaInput from 'components/common/inputs/TextAreaInput';
import Button from 'components/common/Button';
import CustomSelect from 'components/common/inputs/Select/SelectField';
import LocationPrompt from 'components/common/LocationPrompt';

import DeleteClient from 'components/DeleteClient';
import ClientType from 'components/ClientProfile/ClientType';

import useCurrentUser from 'hooks/useCurrentUser';

import getUserName from 'utils/getUserName';
import customGet from 'utils/get';
import { matterSchema } from 'utils/schemas';

const typeOptions = [
  { name: 'Retained', value: 'RETAINED' },
  { name: 'Did not retain', value: 'NOT_RETAINED' },
  { name: 'Potential', value: 'POTENTIAL' },
];

const ProfileMatter = ({ user, updateUser }) => {
  const matter = useMemo(() => customGet(user, 'client.profile.matter', {}), [user]);
  const { me } = useCurrentUser();

  const initialValues = useMemo(
    () => ({
      number: matter?.number || '',
      description: matter?.description || '',
      professionals:
        user?.client?.professionals?.map(pro => ({
          name: getUserName(pro) || pro?.profile?.email,
          label: getUserName(pro) || pro?.profile?.email,
          value: pro.id,
        })) || [],
      type: user?.client?.type,
    }),
    [matter, user],
  );

  const lawyers = useMemo(
    () =>
      me?.professional?.organization?.members.map(member => ({
        label: getUserName(member.user) || member.user?.professional?.profile?.email,
        value: member.user?.professional.id,
      })) || [],
    [me],
  );

  const handleSubmitForm = useCallback(
    ({ number, description, professionals, type }, { setSubmitting }) => {
      setSubmitting(true);

      const matterData = {
        number,
        description,
      };

      const proIds = professionals?.map(option => ({ id: option.value }));

      const variables = {
        data: {
          type,
          professionals: {
            set: proIds?.length ? proIds : [],
          },
          profile: {
            update: {
              matter: {
                upsert: {
                  update: matterData,
                  create: matterData,
                },
              },
            },
          },
        },
        where: {
          id: user?.client?.id,
        },
      };

      updateUser(variables)
        .catch(err => err.graphQLErrors.map(({ message }) => toast.error(message)))
        .finally(() => setSubmitting(false));
    },
    [user, updateUser],
  );

  const formik = useFormik({
    initialValues,
    validationSchema: matterSchema,
    onSubmit: handleSubmitForm,
    validateOnBlur: false,
    enableReinitialize: true,
  });

  const {
    values,
    errors = {},
    handleSubmit,
    isSubmitting,
    setFieldValue,
    setFieldTouched,
  } = formik;

  const handleTypeChange = useCallback(
    ({ value }) => setFieldValue('type', value, true),
    [setFieldValue],
  );

  return (
    <FormikProvider value={formik}>
      <Fragment>
        <LocationPrompt initialValues={initialValues} values={values} />
        <Form className='update-form-container matter' onSubmit={handleSubmit} name='form'>
          <div className='page-inner-header mb-4'>
            <h5 className='mb-1'>File Administration</h5>
            <p className='text-muted mb-0'>
              Edit the matter number, description and professional team for this file.
            </p>
          </div>
          <ClientType client={user?.client} />
          <Row className='align-items-start mt-1'>
            <Col md={6}>
              <TextInput
                name='number'
                label='Matter Number'
                hint='The file number or matter number for this client.'
              />
            </Col>
            <Col md={6}>
              <div className='form-group custom-input'>
                <label className='form-control-label'>Client status</label>
                <CustomSelect name='type' options={typeOptions} handleChange={handleTypeChange} />
              </div>
            </Col>
          </Row>
          <Row className='align-items-start'>
            <Col md={6}>
              <TextAreaInput
                name='description'
                label='Description'
                hint='A brief description of this matter, e.g. "Re: Jones v Smith, divorce and
                separation agreement".'
              />
            </Col>

            {user?.client.intakeForm?.id && (
              <Col md={6}>
                <label className='form-control-label'>Intake info</label>

                <ul className='client-info-list intake'>
                  {user?.client.intakeForm.email && (
                    <li className='client-info-list-item'>
                      <p className='client-info-label'>E-mail:</p>
                      <p className='client-info-value'>{user?.client.intakeForm.email}</p>
                    </li>
                  )}
                  {user?.client.intakeForm.phone && (
                    <li className='client-info-list-item'>
                      <p className='client-info-label'>Phone number:</p>
                      <p className='client-info-value'>{user?.client.intakeForm.phone}</p>
                    </li>
                  )}
                  {user?.client.intakeForm.issue && (
                    <li className='client-info-list-item'>
                      <p className='client-info-label'>Client inquiry</p>
                      <p className='client-info-value'>{user?.client.intakeForm.issue}</p>
                    </li>
                  )}
                  {user?.client.intakeForm.notes && (
                    <li className='client-info-list-item'>
                      <p className='client-info-label'>Intake notes</p>
                      <p className='client-info-value'>{user?.client.intakeForm.notes}</p>
                    </li>
                  )}
                </ul>
              </Col>
            )}
          </Row>
          <Row className='align-items-start'>
            <Col md={6}>
              <div className='form-group custom-input'>
                <label className='form-control-label'>Professionals</label>
                <CustomSelect
                  isMulti
                  isClearable={false}
                  className='multi-select'
                  handleChange={value => {
                    setFieldValue('professionals', value || []);
                    setFieldTouched('professionals', true);
                  }}
                  name='professionals'
                  placeholder='Unassigned'
                  options={lawyers}
                />
              </div>
            </Col>
          </Row>

          <div className='d-flex justify-content-between align-items-end buttons'>
            <Button
              type='submit'
              size='lg'
              leftFAIcon='check'
              disabled={isSubmitting || Object.keys(errors).length !== 0}
            >
              Save & Continue
            </Button>

            <DeleteClient userId={user.client?.user?.id} clientId={user.client?.id} />
          </div>
        </Form>
      </Fragment>
    </FormikProvider>
  );
};

export default ProfileMatter;
