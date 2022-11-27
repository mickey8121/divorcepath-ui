import React, { useCallback, useMemo } from 'react';

import { FormikProvider, useFormik, Form } from 'formik';
import * as yup from 'yup';

import TextInput from 'components/common/inputs/TextInput';
import CustomSelect from 'components/common/inputs/Select/SelectField';
import DayPickerInput from 'components/common/inputs/DayPickerInput';
import InputValidationWrapper from 'components/common/inputs/InputValidationWrapper';
import TextAreaInput from 'components/common/inputs/TextAreaInput';

import RatingStars from 'components/ProProfile/forms/reviews/RatingStars';
import { REVIEW_MODAL } from 'components/ProProfile/forms/reviews/ReviewModal';

import useModal from 'hooks/useModal';
import useCreateReview from 'graphql/hooks/reviews/useCreateReview';
import useUpdateReview from 'graphql/hooks/reviews/useUpdateReview';

const maxDate = new Date();

const validationSchema = () => {
  const rules = {
    reviewerName: yup
      .string()
      .min(2, 'Too Short!')
      .max(40, 'Too Long!')
      .required('Name is required'),
    date: yup
      .date()
      .max(maxDate, "You can't select a date in the future")
      .nullable(true)
      .required('Date is required'),
    content: yup.string().min(20, 'Too short!').required('Description is required'),
    rating: yup.number().required('Rating is required'),
    sourceName: yup.string().required('Description is required'),
    otherSourceName: yup.string().nullable(true).min(2, 'Too short!'),
    sourceUrl: yup.string().url('Please enter correct url').nullable(true),
  };

  return yup.object().shape(rules);
};

const defaultValues = {
  reviewerName: '',
  date: null,
  content: '',
  rating: 5,
  sourceName: 'google',
  otherSourceName: null,
  sourceUrl: null,
};

const ReviewForm = ({ initialValues, formId }) => {
  const { close, options: { refetch } = {} } = useModal(REVIEW_MODAL);

  const { createReview } = useCreateReview(refetch);
  const { updateReview } = useUpdateReview();

  const preparedInitialValues = useMemo(() => {
    if (!initialValues) return defaultValues;

    if (initialValues.sourceName !== 'google' && initialValues.sourceName !== 'facebook')
      return {
        ...initialValues,
        sourceName: 'other',
        otherSourceName: initialValues.sourceName,
      };

    return initialValues;
  }, [initialValues]);

  const onSubmit = useCallback(
    async ({ sourceName, otherSourceName, ...values }) => {
      const data = {
        ...values,
        sourceName: sourceName === 'other' ? otherSourceName : sourceName,
      };

      try {
        if (initialValues) updateReview(data);
        else createReview(data);

        close();
      } catch (error) {}
    },
    [close, createReview, initialValues, updateReview],
  );

  const formik = useFormik({
    initialValues: preparedInitialValues,
    validationSchema,
    validateOnBlur: false,
    enableReinitialize: true,
    onSubmit,
  });

  const { values, handleSubmit, setFieldValue } = formik;

  return (
    <FormikProvider value={formik}>
      <Form id={formId} className='create-review-form' onSubmit={handleSubmit}>
        <div className='row'>
          <div className='col-sm-6'>
            <TextInput autoFocus name='reviewerName' label='Reviewer name' />
          </div>
          <div className='col-sm-6'>
            <DayPickerInput maxDate={maxDate} name='date' label='Date' />
          </div>
        </div>

        <TextAreaInput name='content' label='Review' />

        <div className='row'>
          <div className='col-sm-6'>
            <InputValidationWrapper label='Rating' name='rating' containerClassName='rating-input'>
              <RatingStars large onChange={value => setFieldValue('rating', value)} />
            </InputValidationWrapper>
          </div>

          <div className='col-sm-6'>
            <CustomSelect
              name='sourceName'
              label='Source'
              options={[
                { value: 'google', label: 'Google' },
                { value: 'facebook', label: 'Facebook' },
                { value: 'other', label: 'Other (Please Specify)' },
              ]}
            />
          </div>
        </div>

        {values?.sourceName === 'other' && (
          <TextInput name='otherSourceName' label='Other source' />
        )}

        <TextInput
          name='sourceUrl'
          label='Resource Link'
          className='m-0'
          containerClassName='m-0'
        />
      </Form>
    </FormikProvider>
  );
};

export default ReviewForm;
