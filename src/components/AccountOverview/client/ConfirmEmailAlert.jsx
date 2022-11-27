import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useLocation, useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { Alert } from 'reactstrap';

import Button from 'components/common/Button';

import useCurrentUser from 'hooks/useCurrentUser';

import SEND_VERIFICATION_EMAIL from 'graphql/mutations/user/sendVerificationEmail';

const ConfirmEmailAlert = () => {
  const { me } = useCurrentUser();

  const { state } = useLocation();
  const { replace } = useHistory();

  const [sendVerificationEmail, { loading }] = useMutation(SEND_VERIFICATION_EMAIL);

  const [isShow, setShow] = useState(state?.isVerified);

  const isEmailVerified = useMemo(() => me?.isEmailVerified, [me]);

  useEffect(
    // eslint-disable-next-line consistent-return
    () => {
      if (isShow) {
        const id = setTimeout(() => {
          if (isShow) {
            replace({ pathname: '/', state: {} });
            setShow(false);
          }
        }, 5000);

        return () => {
          clearTimeout(id);
        };
      }
    },
    [isShow, replace, state],
  );

  const handleResend = useCallback(async () => {
    try {
      await sendVerificationEmail();

      toast.success('Verification mail was successfully sent');
    } catch (error) {
      error.graphQLErrors.map(({ message }) => toast.error(message));
    }
  }, [sendVerificationEmail]);

  if (isEmailVerified === false) {
    return (
      <Alert color='warning'>
        Hey friend! Can you
        <span style={{ fontWeight: 'bold' }}> verify your email address </span>
        {`${me?.email} for us? `}
        <Button disabled={loading} onClick={handleResend} size='sm' color='link'>
          Re-send verification mail
        </Button>
      </Alert>
    );
  }

  if (state?.isVerified) {
    return <Alert color='success'>Your mail has been successfully verified.</Alert>;
  }

  return null;
};

export default ConfirmEmailAlert;
