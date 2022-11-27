import React from 'react';

import Footer from 'layout/Footer';
import Header from 'layout/header/Header';

import UpgradePlanModal from 'components/modals/upgrade/UpgradePlanModal';

import LegalIssueModal from 'components/clients/legalIssue/LegalIssueModal';

const Layout = ({ children }) => (
  <div className='page-content'>
    <Header />
    {children}
    <Footer />
    <UpgradePlanModal />
    <LegalIssueModal />
  </div>
);

export default Layout;
