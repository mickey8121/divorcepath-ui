import React, { useMemo } from 'react';

import Button from 'components/common/Button';
import Notification from 'components/common/Notification';

import Interviews from 'components/interviews/Interviews';

import useModal from 'hooks/useModal';

const ClientCardInterviews = ({ client, isShow }) => {
  const interviews = useMemo(() => client?.interviews || [], [client?.interviews]);

  const { open } = useModal('CREATE_INTERVIEW');

  if (!isShow) return null;

  return (
    <div className='interview-card'>
      <Notification
        body={
          <p className='default-notification-text'>
            The client will be emailed an interview request and their answers will be merged with
            any blank profile fields. Any answers different from the profile information on file
            will appear in red. You can merge red answers by clicking on them.
          </p>
        }
        footer
        name='interview-notification'
        paddingContainer='py-2'
      />

      <Interviews interviews={interviews} client={client} />

      <Button
        size='sm'
        color='link'
        leftIcon='plus'
        className='new-interview'
        onClick={() => open({ client })}
      >
        New Interview
      </Button>
    </div>
  );
};

export default ClientCardInterviews;
