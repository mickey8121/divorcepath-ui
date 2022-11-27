import * as yup from 'yup';
import map from 'lodash/map';

import regionNames from 'components/calculations/utils/regionNames';

const string = yup.string().nullable().required('Required field');

export const validationSchema = yup.object().shape({
  phone: string,
  residence: string,
  street1: string,
  postal: string,
  city: string,
});

export const defaultValues = {
  residence: 'QC',
  street1: '',
  city: '',
  postal: '',
  phone: '',
};

export const formInputs = [
  {
    name: 'residence',
    placeholder: 'Province/Territory',
  },
  {
    name: 'city',
    placeholder: 'City/Town',
  },
  {
    name: 'street1',
    placeholder: 'Address',
  },
  {
    name: 'phone',
    placeholder: 'Phone',
  },
  {
    name: 'postal',
    placeholder: 'Postal Code',
  },
];

export const provinceOptions = map(regionNames, (value, label) => ({ value, label }));
