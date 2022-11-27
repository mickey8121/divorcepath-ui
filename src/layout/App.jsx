import React from 'react';

import { ToastContainer, Slide } from 'react-toastify';
import TagManager from 'react-gtm-module';

import Routes from 'layout/Routes/Routes';

import ScrollToTop from 'components/common/ScrollToTop';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

const tagManagerArgs = {
  gtmId: 'GTM-PVTMCSH',
};

TagManager.initialize(tagManagerArgs);

library.add(fas);

const App = () => (
  <React.Fragment>
    <Routes />
    <ToastContainer
      position='top-right'
      transition={Slide}
      autoClose={3000}
      newestOnTop={false}
      rtl={false}
      limit={3}
      hideProgressBar
      closeOnClick
      draggable
      pauseOnHover
    />
    <ScrollToTop />
  </React.Fragment>
);

export default App;
