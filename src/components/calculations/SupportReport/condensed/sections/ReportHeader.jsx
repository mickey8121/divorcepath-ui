import React, { useMemo, useState } from 'react';

import ImageWithErrorHandler from 'components/common/ImageWithErrorHandling';

const imgStyles = {
  position: 'absolute',
  top: '20px',
  right: '20px',
  width: '45%',
  maxHeight: '55px',
  objectFit: 'contain',
};

const ReportHeader = ({
  professional,
  reportTitle,
  clientFirstName,
  exFirstName,
  clientLastName,
  exLastName,
}) => {
  const [isError, setIsError] = useState();

  const today = new Date();
  const month = today.toLocaleString('default', { month: 'long' });

  const orgLogo = useMemo(() => professional?.organization?.logo, [professional]);

  const organizationName = useMemo(() => professional?.organization?.name, [professional]);
  const professionalName = useMemo(
    () => `${professional?.profile?.firstName} ${professional?.profile?.lastName}`,
    [professional],
  );
  const capture = useMemo(
    () => (organizationName ? `Prepared by ${professionalName} from ${organizationName}` : ''),
    [organizationName, professionalName],
  );

  return (
    <div className='row'>
      <div className='col-6'>
        <img
          src='./img/brand/divorcepath-blue.svg'
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            width: orgLogo && !isError ? '45%' : '300px',
            maxHeight: '55px',
          }}
          alt='Divorcepath'
        />

        {orgLogo && (
          <ImageWithErrorHandler src={orgLogo} onError={() => setIsError(true)} style={imgStyles} />
        )}
      </div>
      <div className='col-6'>
        <p className='mb-4'>
          <strong>{reportTitle}</strong>
          <br />
          {`${clientFirstName} ${clientLastName} and ${exFirstName} ${exLastName}`}
          <br />
          {capture} on {`${month} ${today.getDate()}, ${today.getFullYear()}`}
        </p>
      </div>
    </div>
  );
};

export default ReportHeader;
