import React, { useCallback, useMemo, useState } from 'react';

import { useMutation } from '@apollo/client';
import { useDropzone } from 'react-dropzone';
import classnames from 'classnames';
import { toast } from 'react-toastify';
import { Button } from 'reactstrap';

import CustomButton from 'components/common/Button';
import ImageWithErrorHandler from 'components/common/ImageWithErrorHandling';
import UploadImageModal, {
  MIN_HEIGHT,
  MIN_WIDTH,
} from 'components/modals/profile/UploadImageModal';
import Preloader from 'components/common/Preloader';

import useCurrentUser from 'hooks/useCurrentUser';
import useModal from 'hooks/useModal';

import getImageData from 'utils/getImageData';

import UPDATE_PROFESSIONAL from 'graphql/mutations/professional/updateProfessional';
import CREATE_SIGNED_URL from 'graphql/mutations/organization/createSignedUrl';
import UPDATE_CLIENT from 'graphql/mutations/clients/updateClient';

const MODAL_NAME = 'UPLOAD_AVATAR_IMAGE';

const AvatarSelector = ({
  avatar,
  id,
  isPro,
  className,
  width = 50,
  height = 50,
  profilePhotoPro,
}) => {
  const { isActiveSub, isOrgMember } = useCurrentUser();
  const [loading, setLoading] = useState(false);
  const [naturalRatio, setNaturalRatio] = useState(undefined);

  const { open, close } = useModal(MODAL_NAME);

  const [createSignedUrl] = useMutation(CREATE_SIGNED_URL);
  const [updateClient] = useMutation(UPDATE_CLIENT);
  const [updateProfessional] = useMutation(UPDATE_PROFESSIONAL);

  const updateUser = useMemo(
    () => (isPro ? updateProfessional : updateClient),
    [isPro, updateProfessional, updateClient],
  );

  const handleDrop = useCallback(
    async acceptedFiles => {
      if (!acceptedFiles.length) return;

      const file = acceptedFiles[0];
      const { dimensions } = await getImageData(file);

      if (dimensions.width > MIN_WIDTH && dimensions.height > MIN_HEIGHT) {
        open({ file });
      } else {
        toast.error(`Image should be at least ${MIN_WIDTH}x${MIN_HEIGHT}`);
      }
    },
    [open],
  );

  const uploadImage = useCallback(
    async file => {
      setLoading(true);

      try {
        const { data: signedUrlData } = await createSignedUrl();

        if (
          !signedUrlData?.createSignedUrl?.fileName ||
          !signedUrlData?.createSignedUrl?.url ||
          !file
        ) {
          return;
        }

        const { url, fileName } = signedUrlData?.createSignedUrl;

        const headers = new Headers();
        headers.append('Content-Type', file.type);

        const requestOptions = {
          method: 'PUT',
          body: file,
          headers,
          redirect: 'follow',
        };

        await fetch(url, requestOptions);

        const variables = {
          where: { id },
          data: {
            profile: {
              update: {
                avatarUrl: fileName,
              },
            },
          },
        };

        await updateUser({ variables });

        toast.success('Avatar has been successfully updated');
      } catch (error) {
        toast.error(error.message);
      } finally {
        close();
        setLoading(false);
      }
    },
    [close, createSignedUrl, id, updateUser],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: ['.png', '.jpeg', '.jpg'],
    multiple: false,
  });

  const style = useMemo(
    () => ({ objectFit: naturalRatio > 3 || naturalRatio < 0.3 ? 'contain' : 'cover' }),
    [naturalRatio],
  );

  const handleLoadImage = useCallback(e => {
    setNaturalRatio(e.target.naturalWidth / e.target.naturalHeight);
  }, []);

  return (
    <div
      className={classnames(
        'avatar-selector',
        {
          disabled: (isPro && !isActiveSub && !isOrgMember) || loading,
        },
        { 'profile-photo-pro': profilePhotoPro },
        className,
      )}
    >
      {/* eslint-disable-next-line no-negated-condition */}
      {!avatar ? (
        <CustomButton size='sm' leftIcon='plus' color='link' className='w-100' borderDashed>
          Upload your photo
        </CustomButton>
      ) : (
        <ImageWithErrorHandler
          alt='placeholder'
          src={avatar || './img/icons/dusk/png/account.png'}
          style={style}
          width={width}
          height={height}
          imgPlaceholder='./img/icons/dusk/png/account.png'
          onLoad={handleLoadImage}
        />
      )}

      {isPro && (
        <div className='dropzone-container' {...getRootProps()}>
          <input className='dropzone-input' {...getInputProps()} />
          <div className='text-container'>
            {profilePhotoPro && (
              <Button
                onClick={e => e.preventDefault()}
                disabled={(!isOrgMember && !isActiveSub) || loading}
                className='w-100 h-100'
              >
                {loading ? <Preloader type='mutation' /> : !profilePhotoPro && 'Edit'}
              </Button>
            )}
          </div>
        </div>
      )}

      <UploadImageModal
        MODAL_NAME={MODAL_NAME}
        onUploadImage={uploadImage}
        onSelectNewImage={handleDrop}
        initialAspectRatio={1}
        aspectRatio={1}
      />
    </div>
  );
};

export default AvatarSelector;
