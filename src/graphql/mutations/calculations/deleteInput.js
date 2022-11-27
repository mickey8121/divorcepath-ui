import gql from 'graphql-tag';

const DELETE_INPUT = gql`
  mutation deleteInput($where: InputWhereUniqueInput!) {
    deleteInput(where: $where) {
      id
    }
  }
`;

export default DELETE_INPUT;
