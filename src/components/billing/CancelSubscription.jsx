import React from 'react';

import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';

import Preloader from 'components/common/Preloader';
import Button from 'components/common/Button';

import withMe from 'context/MeContext/withMe';

import CANCEL_SUBSCRIPTION from 'graphql/mutations/plans/cancelSubscription';

const CancelSubscription = ({ btnText, refetchMe }) => {
  const [cancelSubscription, { loading }] = useMutation(CANCEL_SUBSCRIPTION);

  return (
    <Button
      disabled={loading}
      onClick={() => {
        cancelSubscription()
          .then(() => refetchMe())
          .catch(err => err.graphQLErrors.map(({ message }) => toast.error(message)));
      }}
    >
      {loading ? <Preloader /> : btnText}
    </Button>
  );
};

CancelSubscription.defaultProps = {
  btnText: 'Cancel subscription',
};

export default withMe(CancelSubscription);
