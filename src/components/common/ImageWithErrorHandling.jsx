import React, { useState, useCallback } from 'react';

const ImageWithErrorHandler = ({
  src,
  alt = '',
  width,
  height,
  style,
  onError,
  className,
  placeholder,
  imgPlaceholder,
  onLoad,
}) => {
  const [isError, setError] = useState(false);

  const handleError = useCallback(() => {
    setError(true);

    if (onError) onError();
  }, [setError, onError]);

  if (isError || !src) {
    if (imgPlaceholder)
      return (
        <img
          src={imgPlaceholder}
          width={width}
          height={height}
          style={style}
          className={className}
          alt='No valid'
        />
      );

    return placeholder || <div />;
  }

  return (
    <img
      alt={alt}
      src={src}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      style={style}
      onLoad={onLoad}
    />
  );
};

export default ImageWithErrorHandler;
