// src/redux/store.js

// ---------------------------------


import { createStore } from 'redux';
import userReducer from './reducers/userReducer';

const loadState = () => {
  try {
    const administration = JSON.parse(localStorage.getItem('administration'));
    const engineer = JSON.parse(localStorage.getItem('engineer'));
    const manager = JSON.parse(localStorage.getItem('manager'));
    const labeler = JSON.parse(localStorage.getItem('annotator'));

    return {
      administration: administration || null,
      engineer: engineer || null,
      manager: manager || null,
      labeler: labeler || null,
    };
  } catch (err) {
    return undefined;
  }
};

const persistedState = loadState();

const store = createStore(
  userReducer,
  persistedState, 
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // Redux DevTools support
);

// Remove saveState and store.subscribe()

export default store;
