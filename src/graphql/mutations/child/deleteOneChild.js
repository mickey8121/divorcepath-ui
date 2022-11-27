import gql from 'graphql-tag';

const DELETE_ONE_CHILD = gql`
  mutation deleteChild($where: ChildrenWhereUniqueInput!) {
    deleteOneChild(where: $where) {
      id
    }
  }
`;

export default DELETE_ONE_CHILD;
