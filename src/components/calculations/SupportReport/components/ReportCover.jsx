import React, { useMemo } from 'react';

import ImageWithErrorHandler from 'components/common/ImageWithErrorHandling';

const ReportCover = ({ clientName, reportTitle, reportType, professional }) => {
  const today = new Date();
  const month = today.toLocaleString('default', { month: 'long' });
  const organizationName = useMemo(() => professional?.organization?.name, [professional]);
  const professionalName = useMemo(
    () => `${professional?.profile?.firstName} ${professional?.profile?.lastName}`,
    [professional],
  );
  const capture = useMemo(
    () => (organizationName ? `prepared by ${professionalName} of ${organizationName}` : ''),
    [organizationName, professionalName],
  );

  const orgLogo = useMemo(() => professional?.organization?.logo, [professional]);

  return (
    <div className='report-cover'>
      <div className='page text-white'>
        <img
          src='./img/brand/divorcepath-white.svg'
          style={{ position: 'absolute', top: '200px', left: '85px', width: '400px' }}
          alt='Divorcepath'
        />
        {orgLogo && (
          <ImageWithErrorHandler
            src={orgLogo}
            style={{
              position: 'absolute',
              bottom: '60px',
              right: '85px',
              maxWidth: '300px',
              maxHeight: '120px',
            }}
          />
        )}
        <span
          className='badge badge-pill pb-3 pt-3'
          style={{
            backgroundColor: '#88a1c9',
            color: '#2b498b',
            fontSize: '1.4rem',
            position: 'absolute',
            top: '710px',
            left: '85px',
          }}
        >
          <strong>Find your path</strong>
        </span>
        <h1 className='text-white' style={{ position: 'absolute', top: '790px', left: '85px' }}>
          {reportTitle}
        </h1>
        <div
          className='text-justify'
          style={{ position: 'absolute', top: '1200px', left: '85px', width: '760px' }}
        >
          <h3 style={{ color: '#3c4858' }}>
            {`A comprehensive report on ${reportType} for ${clientName} 
            ${capture} on ${month} ${today.getDate()}, ${today.getFullYear()}.`}
          </h3>
        </div>
        <div style={{ position: 'absolute', top: '1500px', left: '85px' }}>
          <h5>
            <a className='text-dark no-underline' href='https://www.divorcepath.com'>
              www.divorcepath.com
            </a>
          </h5>
        </div>
      </div>
    </div>
  );
};

export default ReportCover;
