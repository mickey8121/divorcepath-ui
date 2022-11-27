/* eslint-disable no-unused-vars */
import * as yup from 'yup';

import { canadianProvincesArray, canadianTerritoriesArray } from 'utils/places';

const optionsArray = canadianProvincesArray.concat(canadianTerritoriesArray);

const message = 'Required field';
const date = yup.string().nullable().required(message);

const name = yup.string().min(1, 'Too short').nullable().required(message);
// const gender = yup
//   .string()
//   .nullable()
//   .required(message);
const boolean = yup.boolean().required(message);
const parenting = yup.string().oneOf(['CLIENT', 'SHARED', 'EX']).required(message);
// const dependent = yup
//   .string()
//   .oneOf(['CLIENT', 'NONE', 'EX'])
//   .nullable()
//   .required(message);

// const incomeValidationSchema = type =>
//   yup.object().shape({
//     all: yup.string().required()
//   });

const incomeValidationSchema = yup.object().shape({
  all: yup
    .array()
    .of(
      yup.object().shape({
        key: yup.string().required(message),
      }),
    )
    .required(message),
});

const partyValidationSchema = yup.object().shape({
  firstName: name,
  lastName: yup.string().nullable(),
  // gender,
  hasNewPartner: yup
    .boolean()
    .nullable()
    .test('hasNewPartner', message, value => [false, true].includes(value))
    .required(message),
  birthDate: date,
  residence: yup.string().oneOf(optionsArray),
  income: incomeValidationSchema,
});

const childValidationSchema = yup.object().shape({
  firstName: name,
  birthDate: date,
  // gender,
  isOfRelationship: boolean,
  parenting,
});

// makes the children field required if hasChildren === true
function checkChildren() {
  const { parent } = this;
  const children = parent.children || [];

  return !parent.hasChildren || children;
}

const validationSchema = calculatorType => {
  const schema = {
    hasChildren: yup.boolean(),
    title: yup.string().required(message).min(3),
    clientSupportProfile: partyValidationSchema,
    exSupportProfile: partyValidationSchema,
    children: yup.array().nullable().of(childValidationSchema),
  };

  if (calculatorType === 'CHILD') {
    schema.children = yup
      .array()
      .nullable()
      .of(childValidationSchema)
      .required('Required')
      .test('hasChildren', 'Children is required', checkChildren);
  }

  if (calculatorType === 'SPOUSAL') {
    schema.relationship = yup.object().shape({
      cohabitationDate: date,
      separationDate: date,
    });
  }
  return yup.object().shape(schema);
};

export default validationSchema;

const personFormSchema = yup.object().shape({});

export { personFormSchema };

export const email = yup.string().email('Invalid email address').required('Email is required');

export const uniqueEmail = email.test({
  name: 'email',
  message: 'Email is already in list',
  async test(email) {
    const { parent } = this || {};
    const emails = parent?.emails || [];
    return !emails.includes(email);
  },
});
