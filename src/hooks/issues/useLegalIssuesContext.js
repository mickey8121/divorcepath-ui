import { useContext } from 'react';

import LegalIssuesContext from 'context/LegalIssuesContext/LegalIssuesContext';

const useLegalIssuesContext = () => useContext(LegalIssuesContext);

export default useLegalIssuesContext;
