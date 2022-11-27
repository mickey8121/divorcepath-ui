import React, { useMemo } from 'react';

import CalculationsTypeDropdown from 'components/common/CalculationsTypeDropdown';

import useCurrentUser from 'hooks/useCurrentUser';
import useModal from 'hooks/useModal';

const ClientDropdown = ({ clientId, otherLinks: advancedLinks = [], client, ...props }) => {
  const { isPro } = useCurrentUser();

  const { open: openCreateInterviewModal } = useModal('CREATE_INTERVIEW');

  const otherLinks = useMemo(
    () =>
      isPro
        ? [
            {
              pathname: `/clients/${clientId}/edit/background`,
              label: 'Edit Client Profile',
            },
            {
              pathname: `/clients/${clientId}/edit/matter`,
              label: 'View File Admin',
            },
            {
              label: 'Send Interview',
              onClick: () => openCreateInterviewModal({ client }),
              type: 'button',
            },
            ...advancedLinks,
          ]
        : [],
    [advancedLinks, clientId, isPro, openCreateInterviewModal, client],
  );

  return (
    <CalculationsTypeDropdown
      {...props}
      clientId={clientId}
      client={client}
      otherLinks={otherLinks}
    />
  );
};

export default ClientDropdown;
