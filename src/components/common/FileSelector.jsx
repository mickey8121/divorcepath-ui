/* eslint-disable react/jsx-props-no-spreading */
import React, { Fragment, useCallback } from 'react';

import { useDropzone } from 'react-dropzone';
import classnames from 'classnames';
import { Button } from 'reactstrap';

const FileSelector = ({
  onDrop,
  accept,
  label,
  dropActiveLabel,
  description,
  className,
  disabled,
  multiple = true,
  btnLabel = 'Choose file',
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
  });

  const DropzoneContent = useCallback(() => {
    if (isDragActive && dropActiveLabel)
      return <p className='dropzone-content'>{dropActiveLabel}</p>;

    return (
      <Fragment>
        {label && <p className='dropzone-content'>{label}</p>}
        <Button onClick={e => e.preventDefault()} disabled={disabled}>
          {btnLabel}
        </Button>
        {description && <p className='dropzone-content'>{description}</p>}
      </Fragment>
    );
  }, [isDragActive, dropActiveLabel, description, label, btnLabel, disabled]);

  return (
    <div
      className={classnames('dropzone-container', className, { 'active-drop': isDragActive })}
      {...getRootProps()}
    >
      <input className='dropzone-input' {...getInputProps()} />
      <div className='text-container'>
        <DropzoneContent />
      </div>
    </div>
  );
};

export default FileSelector;
