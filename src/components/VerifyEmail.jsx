import React, { useEffect, useCallback } from 'react';

import { useApolloClient, useMutation } from '@apollo/client';
import { useParams, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Container, Alert } from 'reactstrap';

import Preloader from 'components/common/Preloader';

import useCurrentUser from 'hooks/useCurrentUser';

import VERIFY_EMAIL from 'graphql/mutations/user/verifyEmail';
import ME from 'graphql/queries/user/me';

const VerifyEmail = () => {
  const { me } = useCurrentUser();

  const { token } = useParams();
  const { push } = useHistory();
  const apolloClient = useApolloClient();

  const [verifyEmail, { loading, error }] = useMutation(VERIFY_EMAIL);

  useEffect(() => {
    if (token) {
      const variables = {
        data: {
          token,
        },
      };

      verifyEmail({ variables })
        .then(({ data }) => {
          if (data?.verifyEmail?.token && !me?.id) {
            localStorage.setItem('authToken', data?.verifyEmail?.token);
            let event = 'verify_email';
            try {
              apolloClient.writeQuery({
                query: ME,
                data: {
                  me: data?.verifyEmail?.user,
                },
              });
            } catch (err) {
              toast.error(err.message);
              event = 'verify_email_failed';
            } finally {
              const dataLayer = window.dataLayer || [];
              dataLayer.push({
                event,
                traffic_type:
                  window.location.hostname === 'www.divorcepath.com' ? 'external' : 'internal',
              });
            }
          } else {
            push('/', {
              isVerified: true,
            });
          }
        })
        .catch(() => {
          localStorage.setItem('verify-email', token);
          push('/');
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Content = useCallback(() => {
    if (error) {
      return (
        <Alert style={{ color: 'black', fontWeight: 600 }} color='danger'>
          {error.message}
        </Alert>
      );
    }

    return (
      <Alert style={{ color: 'black', fontWeight: 600 }} color='success'>
        Your email has been successfully verified
      </Alert>
    );
  }, [error]);

  return (
    <div className='user-profile'>
      <Container>{loading ? <Preloader /> : <Content />}</Container>
    </div>
  );
};

export default VerifyEmail;
