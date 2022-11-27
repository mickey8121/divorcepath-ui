/* eslint-disable no-underscore-dangle */
import { createStore, combineReducers, compose } from 'redux';

import ducks from 'ducks';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  ...ducks,
});

const resetEnhancer = reducer => (state, action) => {
  if (action.type !== 'RESET') return reducer(state, action);

  const newState = reducer(undefined);

  return newState;
};

const store = createStore(resetEnhancer(rootReducer), composeEnhancers());

if (process.env.NODE_ENV === 'development') {
  window.printStore = () => store.getState();
}

export default store;
