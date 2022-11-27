/* eslint-disable import/prefer-default-export */
// data for different report type options

export const reportTypes = {
  detailed: {
    label: 'Detailed Report',
    title: 'Detailed Child & Spousal Support Report',
    thumbnail: './img/features/detailed-report.png',
    sample:
      'https://app.divorcepath.com/app/files/Sample%20Detailed%20Child%20Support%20Report%20-%20May%2024%202021.pdf',
    description:
      'A detailed PDF report setting out spousal support, \n' +
      'child support and detailed financials for both parties. Includes \n' +
      'explanatory notes, charts, calculation details and all inputs used. \n' +
      'Suitable for court, mediation, or negotiation.',
  },

  condensed: {
    label: 'Condensed Report',
    title: 'Condensed Child & Spousal Support Report',
    thumbnail: './img/features/condensed-report.png',
    sample:
      'https://app.divorcepath.com/app/files/Sample%20Condensed%20Child%20&%20Spousal%20Support%20Report.pdf',
    description:
      'A condensed PDF report setting out spousal support, \n' +
      'child support and detailed financials for both parties. Includes \n' +
      'all calculation details and inputs used but does not include \n' +
      'explanatory notes or additional information. This concise format \n' +
      'is typically used by legal professionals and courts.',
  },
};
