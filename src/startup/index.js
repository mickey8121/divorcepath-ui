import React from 'react';

import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import smoothscroll from 'smoothscroll-polyfill';
import 'chartjs-plugin-doughnutlabel';
import 'chartjs-plugin-deferred';
import 'chartjs-plugin-datalabels';

import 'styles/index.scss';
import App from 'layout/App';

import client from './apollo';
import store from './redux';

smoothscroll.polyfill();

ReactDom.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <BrowserRouter basename='/app'>
        <App />
      </BrowserRouter>
    </Provider>
  </ApolloProvider>,
  document.getElementById('react-root'),
);
