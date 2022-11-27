import { useMutation } from '@apollo/client';

import CREATE_ORGANIZATION from 'graphql/mutations/organization/createOrganization';

const useCreateOrganization = () => {
  const mutation = useMutation(CREATE_ORGANIZATION);

  return mutation;
};

export default useCreateOrganization;
