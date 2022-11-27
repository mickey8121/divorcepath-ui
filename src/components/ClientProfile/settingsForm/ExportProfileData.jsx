import React, { useCallback } from 'react';
import { useApolloClient } from '@apollo/client';

// import FileSaver from 'file-saver';
// import base64ToBlob from 'b64-to-blob';

import Button from 'components/common/Button';
// import { exportUserData as exportUserDataQuery } from '../../../schema/queries/Users.gql';

export const ExportProfileData = ({ user }) => {
  const client = useApolloClient();

  const handleSubmit = useCallback(
    async () => {
      // const { data } = await client.query({
      //   query: exportUserDataQuery
      // });
      // FileSaver.saveAs(base64ToBlob(data.exportUserData.zip), `${user?.client?.id}.zip`);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [client, user],
  );

  return (
    <div className='mt-5 pt-5 delimiter-top'>
      <div className='actions-toolbar py-2 mb-4'>
        <h5 className='mb-1'>Export profile data</h5>
        <p className='text-sm text-muted mb-0'>
          Download all of your documents as .txt files in a .zip
        </p>
      </div>
      <Button size='md' onClick={handleSubmit}>
        Export my data
      </Button>
    </div>
  );
};

export default ExportProfileData;
