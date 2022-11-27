import { useMutation } from '@apollo/client';

import UPDATE_PROFESSIONAL from '../mutations/professional/updateProfessional';

const useUpdateProfessional = () => {
  const mutation = useMutation(UPDATE_PROFESSIONAL);

  return mutation;
};

export default useUpdateProfessional;
