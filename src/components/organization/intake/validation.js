/* eslint-disable indent */
import * as yup from 'yup';

const phoneRegExp = /^[\d ()+-]+$/;

const validationSchema = yup.object().shape({
  website: yup.string().url('Please enter correct url', {
    allowLocal: true,
  }),

  intakesEnabled: yup.bool(),

  email: yup
    .string()
    .email('Please enter correct email')
    .when('intakesEnabled', (field, schema) =>
      field ? schema.required('Email is required') : schema,
    ),
  phone: yup
    .string()
    .matches(phoneRegExp, 'Please enter correct phone number')
    .min(6, 'Please enter correct phone number')
    .max(20, 'Please enter correct phone number')
    .when('intakesEnabled', (field, schema) =>
      field ? schema.required('Phone number is required') : schema,
    ),
  formUrn: yup
    .string()
    .when('intakesEnabled', (field, schema) =>
      field ? schema.required('Please enter the name of the organization or a keyword') : schema,
    ),
});

export default validationSchema;
