import React, { useMemo, useCallback } from 'react';

import { FormikProvider, useFormik } from 'formik';
import { Form } from 'reactstrap';
import { toast } from 'react-toastify';
import capitalize from 'lodash/capitalize';
import isEmpty from 'lodash/isEmpty';

import LocationPrompt from 'components/common/LocationPrompt';
import HttpInput from 'components/common/inputs/HttpInput';

import difference from 'components/calculations/utils/difference';

import useCurrentUser from 'hooks/useCurrentUser';

const SocialMedia = ({ updateUser }) => {
  const { me } = useCurrentUser();

  const [facebook, linkedin, twitter] = useMemo(
    () =>
      ['FACEBOOK', 'LINKEDIN', 'TWITTER'].map(type =>
        me?.professional?.medias?.find(m => m?.type === type),
      ),
    [me?.professional?.medias],
  );

  const initialValues = useMemo(
    () => ({
      facebook: { url: facebook?.url || '', type: 'FACEBOOK' },
      linkedin: { url: linkedin?.url || '', type: 'LINKEDIN' },
      twitter: { url: twitter?.url || '', type: 'TWITTER' },
    }),
    [facebook, linkedin, twitter],
  );

  const onSubmit = useCallback(
    values => {
      const differenceData = difference(values, initialValues);

      if (isEmpty(differenceData)) return null;

      const { facebook, linkedin, twitter } = values;

      const test = [facebook, linkedin, twitter].reduce((acc, t) => {
        const currentMedia = me?.professional?.medias?.find(m => m?.type === t?.type);

        if (!t?.url && !currentMedia?.id) return acc;
        if (!t?.url && currentMedia?.url) {
          acc.delete = [
            ...(acc?.delete || []),
            {
              id: currentMedia?.id,
            },
          ];

          return acc;
        }
        if (t?.url && !currentMedia?.id) {
          acc.create = [
            ...(acc?.create || []),
            {
              type: t?.type,
              url: t?.url,
              name: t?.type === 'LINKEDIN' ? 'LinkedIn' : capitalize(t?.type),
            },
          ];

          return acc;
        }
        if (t?.url && currentMedia?.url) {
          acc.update = [
            ...(acc?.update || []),
            {
              where: {
                id: currentMedia?.id,
              },
              data: {
                url: t?.url,
              },
            },
          ];

          return acc;
        }

        return acc;
      }, {});

      if (!Object.keys(test)?.length) return null;

      const variables = {
        data: {
          medias: test,
        },
        where: {
          id: me?.professional?.id,
        },
      };

      updateUser({ variables })
        .then(() => toast.success('Social medias has been successfully changed'))
        .catch(err => err.graphQLErrors.map(({ message }) => toast.error(message)));
    },
    [updateUser, me?.professional?.id, me?.professional?.medias, initialValues],
  );

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit,
  });

  const { values, handleSubmit } = formik;

  return (
    <FormikProvider value={formik}>
      <LocationPrompt initialValues={initialValues} values={values} />
      <Form className='update-form username-form'>
        <div className='inputs-container'>
          <div className='left-side'>
            <h4 className='title'>Social media</h4>
            <p className='subtitle'>
              Your social networks will be displayed on your Public Directory.
            </p>
          </div>
          <div className='right-side'>
            <HttpInput
              size='md'
              name='facebook.url'
              label='Facebook'
              placeholder='https://www.facebook.com/example'
              onBlur={handleSubmit}
            />
            <HttpInput
              size='md'
              name='linkedin.url'
              placeholder='https://www.linkedin.com/example'
              label='Linkedin'
              onBlur={handleSubmit}
            />
            <HttpInput
              size='md'
              name='twitter.url'
              containerClassName='mb-0'
              placeholder='https://twitter.com/example'
              label='Twitter'
              onBlur={handleSubmit}
            />
          </div>
        </div>
      </Form>
    </FormikProvider>
  );
};

export default SocialMedia;
