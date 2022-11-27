/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
import { ApolloClient, InMemoryCache, fromPromise, ApolloLink } from '@apollo/client';
import { onError } from '@apollo/link-error';

import MultiAPILink from 'startup/MultiAPILink';

import getNewToken from 'utils/getNewToken';

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      const { message, location, path } = err;

      if (message.includes('You do not have access')) {
        if (window) window.location.replace('/app');
      }

      if (message.includes('prisma.supportCalculation.update()')) {
        localStorage.setItem('hasError', 'true');
        if (window) window.location.reload();
      }

      if (message === 'Not Authorised!') {
        const oldToken = localStorage.getItem('authToken') || '';

        if (oldToken && process.env.NODE_ENV !== 'development') {
          return fromPromise(getNewToken()).flatMap(accessToken => {
            const oldHeaders = operation.getContext().headers;

            if (accessToken) localStorage.setItem('authToken', accessToken);
            else {
              localStorage.removeItem('authToken');
            }

            operation.setContext({
              headers: {
                ...oldHeaders,
                Authorization: accessToken,
              },
            });

            return forward(operation);
          });
        }
      }

      const textError = `[GraphQL error]: ${message}, Location: ${location}, Path: ${path}`;

      console.error(textError);
    }
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

const multiLink = new MultiAPILink();

const link = ApolloLink.from([errorLink, multiLink]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;
