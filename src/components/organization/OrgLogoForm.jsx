import React, { useCallback, useMemo, useState } from 'react';

import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { Row } from 'reactstrap';

import FileSelector from 'components/common/FileSelector';
import UploadImageModal from 'components/modals/profile/UploadImageModal';
import Preloader from 'components/common/Preloader';

import useCurrentUser from 'hooks/useCurrentUser';
import useModal from 'hooks/useModal';

import CREATE_SIGNED_URL from 'graphql/mutations/organization/createSignedUrl';
import UPDATE_ORGANIZATION from 'graphql/mutations/organization/updateOrganization';

const MODAL_NAME = 'UPLOAD_ORG_IMAGE';

const OrgLogoForm = ({ organization, type, backgroundColor }) => {
  const { isOrgAdmin } = useCurrentUser();
  const { open } = useModal(MODAL_NAME);

  const [logo, setLogo] = useState(organization?.[type]);
  const [loading, setLoading] = useState(false);

  const [createSignedUrl] = useMutation(CREATE_SIGNED_URL);
  const [updateOrganization] = useMutation(UPDATE_ORGANIZATION);

  const isDisabled = useMemo(() => loading || !isOrgAdmin, [loading, isOrgAdmin]);

  const handleDrop = useCallback(
    async acceptedFiles => {
      if (!acceptedFiles.length) return;

      const file = acceptedFiles[0];

      open({ file });
    },
    [open],
  );

  const handleUploadImage = useCallback(
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
          where: { id: organization?.id },
          data: {
            [type]: fileName,
          },
        };

        await updateOrganization({ variables });
        setLogo(file);

        toast.success('Organization logo has been successfully updated');
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    },
    [createSignedUrl, organization?.id, type, updateOrganization],
  );

  return (
    <div className='mt-3 logo-form'>
      {logo && (
        <div className={`logo-container ${loading ? 'loading' : ''}`} style={{ backgroundColor }}>
          {loading && <Preloader type='mutation' mutationClassName='org-logo-preloader' />}
          <img
            src={typeof logo === 'string' ? logo : URL.createObjectURL(logo)}
            alt='Organization logo'
            width='200'
          />
        </div>
      )}

      <Row className='ml-0 mt-3 buttons'>
        <FileSelector
          btnLabel={logo ? 'Choose new logo' : 'Choose organization logo'}
          className='mr-2'
          onDrop={handleDrop}
          accept='.jpg,.png,.jpeg,.svg'
          multiple={false}
          disabled={isDisabled}
        />
      </Row>

      {/* {type === 'logo' && ( */}
      {/*  <p className='small mt-2 mb-0'>The uploaded image must be at least 200x200.</p> */}
      {/* )} */}

      <UploadImageModal
        MODAL_NAME={MODAL_NAME}
        onUploadImage={handleUploadImage}
        onSelectNewImage={handleDrop}
        initialAspectRatio={type === 'logo' && 1}
        aspectRatio={type === 'logo' && 1}
      />
    </div>
  );
};

export default OrgLogoForm;
