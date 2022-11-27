import { ApolloLink, HttpLink } from '@apollo/client';
import { removeDirectivesFromDocument } from '@apollo/client/utilities';

const API_URL = process.env.REACT_APP_GRAPHQL_API;
const SANITY_API_URL = process.env.REACT_APP_SANITY_API;

class MultiAPILink extends ApolloLink {
  httpLink = ApolloLink;

  constructor(request) {
    super(request);
    this.httpLink = new HttpLink({ credentials: 'include' });
  }

  request(operation, forward) {
    const apiName = operation.query.definitions
      .find(definition => definition.kind === 'OperationDefinition')
      ?.directives?.find(directive => directive.name?.value === 'api')
      ?.arguments?.find(argument => argument.name?.value === 'name')?.value?.value;

    const query = removeDirectivesFromDocument([{ name: 'api', remove: true }], operation.query);

    if (!query) {
      throw new Error('Error while removing directive api');
    }

    // eslint-disable-next-line no-param-reassign
    operation.query = query;

    switch (apiName) {
      case 'sanity': {
        operation.setContext({
          uri: SANITY_API_URL,
          headers: {},
        });
        break;
      }

      default: {
        const oldHeaders = operation.getContext().headers;

        operation.setContext({
          uri: API_URL,
          headers: {
            ...oldHeaders,
            Authorization: localStorage.getItem('authToken') || '',
          },
        });
      }
    }

    return this.httpLink.request(operation, forward);
  }
}

export default MultiAPILink;
