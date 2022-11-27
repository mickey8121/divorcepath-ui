import React, { useMemo, useCallback, useState } from 'react';

import { useField, useFormikContext } from 'formik';
import { FormGroup, Label, Input } from 'reactstrap';
import kebabCase from 'lodash/kebabCase';
import { toast } from 'react-toastify';
import classnames from 'classnames';

export const getFormattedUrn = (value, defaultValue) =>
  value ? kebabCase(value).trim() : defaultValue;

const IntakeFormUrnInput = ({ onBlur }) => {
  const { setFieldValue, values, errors } = useFormikContext();
  const [field, { error }] = useField('formUrn');

  const [isFocused, setIsFocused] = useState(false);

  const handleFormUrnInputBlur = useCallback(() => {
    const formattedFormUrn = getFormattedUrn(values.formUrn);

    onBlur({ target: { name: field.name, value: formattedFormUrn } });
    setIsFocused(false);
    setFieldValue('formUrn', formattedFormUrn);
  }, [values, onBlur, field, setFieldValue]);

  const handleFocus = useCallback(() => setIsFocused(true), []);

  const intakeLink = useMemo(
    () => `${process.env.REACT_APP_INTAKE_FORM_LINK}/${values.formUrn}`,
    [values],
  );

  const handleCopyToClipBoard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(intakeLink);

      return toast.success('Url copied to the clipboard');
    } catch (err) {
      return null;
    }
  }, [intakeLink]);

  return (
    <FormGroup
      className={classnames('custom-input-form-urn custom-input mb-0', {
        invalid: !!errors.formUrn,
        focused: isFocused,
      })}
    >
      <div className='d-flex justify-content-between'>
        <Label htmlFor='formUrn' className='form-control-label'>
          Desired form address <span className='required-field'>*</span>
        </Label>
        <button type='button' className='btn-copy' onClick={handleCopyToClipBoard}>
          Copy
        </button>
      </div>
      <div className='input-container input-group' data-url={intakeLink}>
        <Input
          type='text'
          className='input-sm custom-input-form-urn-control'
          {...field}
          onBlur={handleFormUrnInputBlur}
          onFocus={handleFocus}
        />
      </div>
      {error && <div className='invalid-feedback fade show'>{error}</div>}
    </FormGroup>
  );
};

export default IntakeFormUrnInput;
