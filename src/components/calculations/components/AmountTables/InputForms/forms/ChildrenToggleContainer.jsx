import React from 'react';

import { useFormikContext } from 'formik';
import { get } from 'lodash';

import LearnMoreLink from 'components/calculations/components/common/LearnMoreLink';

import ChildrenToggleList from 'components/calculations/components/AmountTables/InputForms/forms/ChildrenToggleList';

const ChildrenToggleContainer = ({ displayInfo, partyType }) => {
  const { values } = useFormikContext();

  const clientFirstName = get(values, `${partyType}.firstName`, '');

  return (
    <span className='form-group text-muted mb-0'>
      <LearnMoreLink to='/' description={displayInfo.description} className='mt-0' />

      <p className='py-2'>
        {`Select which children ${clientFirstName} claims child benefits for (applies to all child benefits):`}
      </p>

      <ChildrenToggleList partyType={partyType} />
    </span>
  );
};

export default ChildrenToggleContainer;
