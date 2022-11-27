/* eslint-disable no-unused-expressions */
import { useContext } from 'react';

import { useHistory } from 'react-router';
import { useMutation, useApolloClient } from '@apollo/client';
import { merge } from 'lodash';
import { toast } from 'react-toastify';

import MeContext from 'context/MeContext/MeContext';

import UPDATE_CLIENT from 'graphql/mutations/clients/updateClient';

const useUpdateUser = ({ refetchQuery }) => {
  const history = useHistory();
  const apolloClient = useApolloClient();
  const { refetchMe } = useContext(MeContext);

  const [updateMutation] = useMutation(UPDATE_CLIENT);

  return nextPath => (variables, callback) =>
    updateMutation({ variables })
      .then(res => {
        if (refetchQuery.query) {
          const cachedProfile = apolloClient.readQuery({
            query: refetchQuery.query,
            variables: refetchQuery.variables,
          });

          apolloClient.writeQuery({
            query: refetchQuery.query,
            variables: refetchQuery.variables,
            data: {
              user: merge({}, cachedProfile.user, res.data.updateUser),
            },
          });
        }

        // Bert.alert('Profile updated!', 'success');
        refetchMe();

        if (nextPath) {
          history.push(nextPath);

          const element = document.querySelector('.profile-header');

          element?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }

        if (callback) callback();
      })
      .catch(err => err.graphQLErrors.map(({ message }) => toast.error(message)));
};

export default useUpdateUser;
