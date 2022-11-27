import gql from 'graphql-tag';

import CHILDREN from 'graphql/fragments/children';

const CREATE_ONE_CHILD = gql`
  ${CHILDREN}

  mutation createChild($data: ChildrenCreateInput!) {
    createOneChild(data: $data) {
      ...CHILDREN
    }
  }
`;

export default CREATE_ONE_CHILD;
