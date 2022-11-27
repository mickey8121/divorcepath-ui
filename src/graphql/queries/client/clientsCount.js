import gql from 'graphql-tag';

const CLIENTS_COUNT = gql`
  query clientsCount($whereMany: [ClientWhereInput!]) {
    clientsCount(whereMany: $whereMany) {
      counts
    }
  }
`;

export default CLIENTS_COUNT;
