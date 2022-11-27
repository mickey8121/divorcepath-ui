import React, { useCallback, useRef } from 'react';

import { Cropper } from 'react-cropper';

import Modal from 'components/common/Modal';

import useModal from 'hooks/useModal';
import 'cropperjs/dist/cropper.css';

export const MIN_HEIGHT = 200;
export const MIN_WIDTH = 200;

const UploadImageModal = ({
  MODAL_NAME = 'UPLOAD_IMAGE',
  onUploadImage,
  onSelectNewImage,
  initialAspectRatio,
  aspectRatio,
}) => {
  const { options } = useModal(MODAL_NAME);
  const cropperRef = useRef(null);

  const handleSubmit = useCallback(() => {
    cropperRef?.current?.cropper
      ?.getCroppedCanvas({
        maxWidth: 1200,
        maxHeight: 1200,
      })
      ?.toBlob(blob => {
        onUploadImage(new File([blob], options?.file?.name || 'cropped.png'));
      });
  }, [onUploadImage, options?.file?.name]);

  const imageURL = options?.file ? URL.createObjectURL(options?.file) : '';

  const handleSelectNewImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => {
      onSelectNewImage(e.target.files);
    };

    input.click();
  }, [onSelectNewImage]);

  return (
    <Modal
      name={MODAL_NAME}
      title='Image Upload'
      size='lg'
      className='upload-image-modal'
      showCloseButton
      onSubmitClick={handleSubmit}
      submitButtonTitle='Upload'
    >
      <Cropper
        ref={cropperRef}
        src={imageURL}
        crop={e => {
          if (
            MODAL_NAME === 'UPLOAD_AVATAR_IMAGE' &&
            (e.detail.width < MIN_WIDTH || e.detail.height < MIN_HEIGHT)
          ) {
            e.preventDefault();

            const data = cropperRef.current.cropper.getData();

            if (e.detail.width < MIN_WIDTH) {
              data.width = MIN_WIDTH;
            }
            if (e.detail.height < MIN_HEIGHT) {
              data.height = MIN_HEIGHT;
            }

            cropperRef.current.cropper.setData(data);
          }
        }}
        modal
        zoomable={false}
        zoom={false}
        zoomOnWheel={false}
        zoomOnTouch={false}
        autoCropArea={1}
        initialAspectRatio={initialAspectRatio}
        aspectRatio={aspectRatio}
        className='cropper-box'
      />
      <div className='select-new-image-btn btn-link' onClick={handleSelectNewImage}>
        Select another image
      </div>
    </Modal>
  );
};

export default UploadImageModal;
