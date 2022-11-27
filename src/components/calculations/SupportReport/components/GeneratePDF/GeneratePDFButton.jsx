import React from 'react';

import Button from 'components/common/Button';

const GeneratePDFButton = ({ disabled, loading, text, handleClick, className }) => (
  <Button
    disabled={disabled || loading}
    onClick={handleClick}
    className={className}
    size='md'
    rightIcon={loading ? 'spinner' : 'file'}
    spin={loading}
  >
    {text}
  </Button>
);

export default GeneratePDFButton;
