import React, { useCallback, useMemo, useState, useEffect } from 'react';

import { useFormik, FormikProvider, Form } from 'formik';
import kebabCase from 'lodash/kebabCase';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import isEmpty from 'lodash/isEmpty';

import TextInput from 'components/common/inputs/TextInput';
import ColorPicker from 'components/common/inputs/ColorPicker';
import ToggleCheckbox from 'components/common/inputs/ToggleCheckbox';
import HttpInput from 'components/common/inputs/HttpInput';
import TextAreaInput from 'components/common/inputs/TextAreaInput';

import difference from 'components/calculations/utils/difference';
import scrollToError from 'components/calculations/sidebar/scrollToError';
import validationSchema from 'components/organization/intake/validation';
import IntakeFormUrnInput from 'components/organization/intake/IntakeFormUrnInput';
import OrgLogoForm from 'components/organization/OrgLogoForm.jsx';

import UPDATE_ORGANIZATION from 'graphql/mutations/organization/updateOrganization';

const getFormattedUrn = value => kebabCase(value).trim();

const IntakeAdminPanelForm = ({ organization }) => {
  const [updateOrganization] = useMutation(UPDATE_ORGANIZATION);
  const [isFormUrnUsed, setIsFormUrnUsed] = useState(null);

  const headerFields = useMemo(() => {
    try {
      return JSON.parse(organization?.intakeFormHeader) ?? {};
    } catch (err) {
      return {};
    }
  }, [organization]);

  const initialValues = useMemo(
    () => ({
      primaryColor: organization?.primaryColor || '#6E00FF',
      backgroundColor: organization?.backgroundColor || '#21282F',
      intakesEnabled: organization?.intakesEnabled,
      formUrn: organization?.formUrn || '',
      website: organization?.locations[0]?.website || '',
      email: organization?.locations[0]?.email || '',
      phone: organization?.locations[0]?.phone || '',
      intakeSubmittedTitle: organization?.intakeSubmittedTitle || '',
      intakeSubmittedMessage: organization?.intakeSubmittedMessage || '',
      intakeFormHeader: headerFields.intakeFormHeader || '',
      intakeFormSubHeader: headerFields.intakeFormSubHeader || '',
      intakeFormFooter: organization?.intakeFormFooter || '',
    }),
    [headerFields, organization],
  );

  const onSubmit = useCallback(
    async ({ formUrn: formUrnRaw, ...values }) => {
      const formUrn = getFormattedUrn(formUrnRaw, initialValues.formUrn);

      const differenceData = difference({ formUrn, ...values }, initialValues);

      if (isEmpty(differenceData)) return null;

      const {
        email,
        phone,
        website,
        intakeFormHeader: intakeFormHeaderRaw,
        intakeFormSubHeader,
        ...data
      } = differenceData;

      const intakeFormHeader = JSON.stringify({
        intakeFormHeader: intakeFormHeaderRaw,
        intakeFormSubHeader,
      });

      const locationsData = { website, email, phone };
      const locations = {
        locations: {
          ...(organization.locations[0]?.id
            ? {
                update: { data: { ...locationsData }, where: { id: organization.locations[0].id } },
              }
            : { create: { ...locationsData } }),
        },
      };

      try {
        return await toast.promise(
          updateOrganization({
            variables: {
              where: {
                id: organization.id,
              },
              data: {
                ...data,
                intakeFormHeader,
                ...locations,
              },
            },
          }),
          {
            pending: 'Updating intake information',
            success: 'Intake information is updated',
            error: 'Intake information is not updated',
          },
        );
      } catch (err) {
        return err.graphQLErrors?.map(({ message }) => {
          if (message === 'Intake form organization name already in use') {
            return setIsFormUrnUsed(true);
          }

          return null;
        });
      }
    },
    [initialValues, organization.id, organization.locations, updateOrganization],
  );

  const formik = useFormik({
    validateOnMount: false,
    initialValues,
    validationSchema,
    validateOnChange: true,
    validateOnBlur: false,
    enableReinitialize: true,
    onSubmit,
  });

  const {
    handleSubmit,
    values: { intakesEnabled, formUrn, ...formValues },
    setFieldValue,
    isValid,
    resetForm,
    validateForm,
    setFieldTouched,
    setFieldError,
  } = formik;

  const handleBlur = useCallback(
    ({ target: { value, name } }) => {
      if (!isValid) {
        toast.info('Enter valid field value, or disable the form and clear field');
        return resetForm({ values: initialValues, errors: {} });
      }

      return handleSubmit({ [name]: value });
    },
    [isValid, handleSubmit, resetForm, initialValues],
  );

  const FormUrnDescription = useCallback(() => {
    if (!organization?.intakesEnabled || !intakesEnabled) {
      return <p className='subtitle'>enable your intake form to view it at this address</p>;
    }

    return (
      <a
        href={`${process.env.REACT_APP_INTAKE_FORM_LINK}/${formUrn}`}
        target='_blank'
        rel='noreferrer noopener'
      >
        View your client intake form
      </a>
    );
  }, [organization, intakesEnabled, formUrn]);

  useEffect(() => {
    if (isFormUrnUsed) {
      setFieldError('formUrn', 'Such a keyword is already in use');
      setIsFormUrnUsed(false);
    }
  }, [initialValues, isFormUrnUsed, resetForm, setFieldError]);

  return (
    <div className='update-form-container intake'>
      <FormikProvider value={formik}>
        <Form onSubmit={handleSubmit}>
          <div className='intake-header-container'>
            <div className='intake-header'>
              <h5 className='title'>Intake form</h5>
            </div>
            <ToggleCheckbox
              isChecked={intakesEnabled}
              onChange={() => {
                if ((!formUrn || !formValues.email || !formValues.phone) && !intakesEnabled) {
                  validateForm({ intakesEnabled: true, formUrn, ...formValues });
                  setFieldTouched('formUrn');
                  setFieldTouched('email');
                  setFieldTouched('phone');

                  return scrollToError();
                }

                validateForm({ intakesEnabled: !intakesEnabled, formUrn, ...formValues });

                setFieldValue('intakesEnabled', !intakesEnabled);
                return handleSubmit({ intakesEnabled: !intakesEnabled });
              }}
            />
          </div>
          <div className='update-form-content pb-0'>
            <div className='update-form urn-form'>
              <div className='inputs-container'>
                <div className='left-side'>
                  <h4 className='title'>Address</h4>
                  <p className='subtitle'>
                    Update a word or phrase that will end the link to your intake form
                  </p>
                  <p className='subtitle'>* required field</p>
                  <FormUrnDescription />
                </div>
                <div className='right-side'>
                  <IntakeFormUrnInput onBlur={handleBlur} />
                </div>
              </div>
            </div>

            <div className='divider' />

            <div className='update-form contacts-form'>
              <div className='inputs-container'>
                <div className='left-side'>
                  <h4 className='title'>Contacts</h4>
                  <p className='subtitle'>
                    You will receive notification of a new client to this email address
                  </p>
                  <p className='subtitle'>* required fields</p>
                </div>
                <div className='right-side'>
                  <TextInput
                    name='email'
                    label='Email'
                    placeholder='example@domain.com'
                    onBlur={handleBlur}
                    isRequired
                  />
                  <TextInput
                    type='tel'
                    name='phone'
                    label='Phone number'
                    placeholder='250-555-0199'
                    onBlur={handleBlur}
                    isRequired
                  />
                </div>
              </div>
            </div>

            <div className='divider' />

            <div className='update-form content-form'>
              <div className='inputs-container'>
                <div className='left-side'>
                  <h4 className='title'>Form content</h4>
                  <p className='subtitle'>
                    You can change the text in the header and footer of your intake form
                  </p>
                  <p className='subtitle'>* not required</p>
                </div>
                <div className='right-side'>
                  <TextAreaInput
                    label='Header'
                    type='textarea'
                    onBlur={handleBlur}
                    placeholder='Free 15-minute phone consultation with a family lawyer. We can discuss your divorce or other legal matter and next steps.'
                    name='intakeFormHeader'
                  />
                  <TextAreaInput
                    label='Subheader'
                    type='textarea'
                    placeholder='All discussions confidential.'
                    name='intakeFormSubHeader'
                    onBlur={handleBlur}
                  />
                  <TextAreaInput
                    label='Footer'
                    type='textarea'
                    placeholder='We normally respond within one business day. Your inquiry does not create a solicitor/client relationship.'
                    name='intakeFormFooter'
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            </div>

            <div className='divider' />

            <div className='update-form success-page-form'>
              <div className='inputs-container'>
                <div className='left-side'>
                  <h4 className='title'>Success page</h4>
                  <p className='subtitle'>
                    You can change the text that will be shown on the "Success page" page after
                    submit the form
                  </p>
                  <p className='subtitle'>* not required</p>
                  {formUrn && (
                    <a
                      href={`${process.env.REACT_APP_INTAKE_FORM_LINK}/${formUrn}/thank-you`}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      View your success page
                    </a>
                  )}
                </div>
                <div className='right-side'>
                  <TextInput
                    name='intakeSubmittedTitle'
                    label='Title'
                    placeholder='Thank you for contacting us!'
                    onBlur={handleBlur}
                  />
                  <TextAreaInput
                    type='textarea'
                    placeholder='Your information has been sent. You will be contacted shortly.'
                    name='intakeSubmittedMessage'
                    label='Description'
                    onBlur={handleBlur}
                  />

                  <HttpInput
                    name='website'
                    label='Organization'
                    placeholder='https://www.your-organization-domain.com'
                    onBlur={handleBlur}
                    hint='Full URL of your organization for the "Back to organization" button'
                  />
                </div>
              </div>
            </div>

            <div className='divider' />

            <div className='update-form color-form'>
              <div className='inputs-container'>
                <div className='left-side'>
                  <h4 className='title'>Color</h4>
                  <p className='subtitle'>Update the colors of the intake form.</p>
                  <p className='subtitle'>* click on color or enter color code</p>
                </div>
                <div className='right-side'>
                  <div className='color-container'>
                    <ColorPicker label='Background' name='backgroundColor' onChange={handleBlur} />
                    <ColorPicker label='Accent' name='primaryColor' onChange={handleBlur} />
                  </div>
                </div>
              </div>
            </div>

            <div className='divider' />
          </div>
        </Form>
      </FormikProvider>
      <div className='update-form-content pt-0'>
        <div className='update-form logo-form-container'>
          <div className='inputs-container'>
            <div className='left-side'>
              <h4 className='title'>Logo</h4>
              <p className='subtitle'>
                The uploaded image must be at least 50x50 and no more than 400x400, and the height
                must not exceed the width.
              </p>
            </div>
            <div className='right-side'>
              <div className='logo'>
                <OrgLogoForm
                  organization={organization}
                  type='intakeFormLogo'
                  backgroundColor={formValues.backgroundColor}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntakeAdminPanelForm;
