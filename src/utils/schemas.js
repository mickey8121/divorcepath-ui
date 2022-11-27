import * as yup from 'yup';

const defaultString = yup.string().min(2, 'Too Short!').max(50, 'Too Long!');

const firstName = defaultString;
const lastName = defaultString;
const middleName = yup.string().max(50, 'Too Long!').nullable();

const email = yup.string().email().nullable();

const phone = yup.string().nullable();
const date = yup.string().nullable();

const gender = yup.string().nullable();

const address = yup.string().max(500, 'Too Long!');

const isRequired = (p, schema) => (p ? schema.required('Required') : schema);

export const backgroundSchema = yup.object().shape({
  firstName: firstName.nullable().when('$isClient', isRequired),
  lastName: lastName.nullable().when('$isClient', isRequired),
  middleName,
  birthDate: date.when('$isClient', isRequired),
  gender: gender.nullable(),
  email: email.nullable(),
  phone,
});

export const addressSchema = yup.object().shape({
  street1: address.nullable(),
  city: address.nullable(),
  residence: address.nullable(),
  country: address.nullable(),
  street2: yup.string().max(50, 'Too Long!').nullable(),
  postal: yup.string().nullable(),
});

export const childrenSchema = yup.object().shape({
  isHaveChildren: yup.boolean(),
  children: yup
    .array()
    .of(
      yup.object().shape({
        firstName: firstName.when('$isClient', isRequired),
        lastName: yup
          .string()
          .max(50, 'Too Long!')
          .when('$isClient', (isClient, schema) =>
            isClient ? schema.min(2, 'Too Short!').required() : schema,
          ),
        middleName,
        birthDate: date.when('$isClient', isRequired),
        gender: gender.when('$isClient', isRequired),
        isOfRelationship: yup.boolean().when('$isClient', isRequired),
        isDependent: yup.boolean().when('$isClient', isRequired),
        parenting: yup.string().oneOf(['CLIENT', 'SHARED', 'EX']).when('$isClient', isRequired),
      }),
    )
    .nullable(),
});

export const relationshipSchema = yup.object().shape({
  relationship: yup.object().shape({
    cohabitationDate: yup
      .string()
      .when('$isClient', (isClient, schema) => (isClient ? schema.required() : schema.nullable())),
    marriageDate: yup
      .string()
      .when(['$isClient', 'isMarried'], (isClient, married, schema) => {
        if (isClient && married) return schema.required('Required');
        return schema;
      })
      .nullable(),
    separationDate: yup
      .string()
      .when(['$isClient', 'isSeparated'], (isClient, separated, schema) => {
        if (isClient && separated) return schema.required('Required');
        return schema;
      })
      .nullable(),
    isMarried: yup.boolean().nullable(),
    isSeparated: yup.boolean().nullable(),
  }),
});

export const matterSchema = yup.object().shape({
  number: defaultString,
  description: defaultString,
  type: yup.string(),
  professionals: yup
    .array()
    .when('type', (field, schema) =>
      field === 'RETAINED' || field === 'POTENTIAL'
        ? schema.min(1, 'Please assign a professional')
        : schema,
    ),
});

export const newClientSchema = yup.object().shape({
  firstName: firstName.required("What's client first name?"),
  lastName: lastName.required("What's client last name?"),
  middleName,
  email,
  phone,
});
