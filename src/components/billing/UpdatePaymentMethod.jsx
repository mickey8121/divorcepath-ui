import React from 'react';

import { useMutation } from '@apollo/client';
import { get } from 'lodash';
import { toast } from 'react-toastify';

import Preloader from 'components/common/Preloader';
import Button from 'components/common/Button';

import UPDATE_PAYMENT_METHOD from 'graphql/mutations/plans/updatePaymentMethod';

const UpdatePaymentMethod = ({ stripe, isActiveSub }) => {
  const [updatePaymentMethod, { called }] = useMutation(UPDATE_PAYMENT_METHOD);

  const handleClick = () => {
    updatePaymentMethod()
      .then(({ data }) => {
        stripe.redirectToCheckout({
          sessionId: get(data, 'updatePaymentMethod', ''),
        });
      })
      .catch(err => err.graphQLErrors.map(({ message }) => toast.error(message)));
  };

  return (
    <Button disabled={!isActiveSub} className='mt-4' onClick={handleClick}>
      {called ? <Preloader /> : 'Update payment method'}
    </Button>
  );
};

export default UpdatePaymentMethod;
