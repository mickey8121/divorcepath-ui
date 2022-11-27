import React, { Fragment } from 'react';

import ReportCover from 'components/calculations/SupportReport/components/ReportCover';
import TableOfContents from 'components/calculations/SupportReport/components/TableOfContents';

const PaperplanePage = ({
  clientName,
  exName,
  reportTitle,
  reportType,
  professional,
  showChildSupportResults,
  showSpousalSupport,
}) => (
  <Fragment>
    <ReportCover
      clientName={clientName}
      exName={exName}
      reportTitle={reportTitle}
      reportType={reportType}
      professional={professional}
    />

    <TableOfContents
      showChildSupportResults={showChildSupportResults}
      showSpousalSupport={showSpousalSupport}
    />
  </Fragment>
);

export default PaperplanePage;
