const paths = [
  {
    firstPath: 'clientSpousalSupport.federalCredits.all',
    secondPath: 'clientSpousalSupport.provincialCredits.all',
    itemPath: 'userInputs.[0].floatData',
  },
  {
    firstPath: 'exSpousalSupport.federalCredits.all',
    secondPath: 'exSpousalSupport.federalCredits.all',
    itemPath: 'userInputs.[0].floatData',
  },
  {
    firstPath: 'clientSpousalSupport.federalDeductions.all',
    secondPath: 'clientSpousalSupport.provincialDeductions.all',
  },
  {
    firstPath: 'exSpousalSupport.federalDeductions.all',
    secondPath: 'exSpousalSupport.provincialDeductions.all',
  },
  {
    firstPath: 'clientSpousalSupport.federalBenefits.all',
    secondPath: 'clientSpousalSupport.provincialBenefits.all',
  },
  {
    firstPath: 'exSpousalSupport.federalBenefits.all',
    secondPath: 'exSpousalSupport.provincialBenefits.all',
  },
];

export default paths;
