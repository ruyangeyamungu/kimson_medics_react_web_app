
import { legacy_createStore } from 'redux';
import { SET_NAMES, SET_REG_NO } from './action';

const initialState = {
  regNo: null,
  names:null,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_REG_NO:
      return { ...state, regNo: action.payload };
    case SET_NAMES:
        return { ...state, names: action.payload };
    default:
      return state;
  }
}

// Load state from sessionStorage
function loadState() {
    try {
      const serializedState = sessionStorage.getItem('state');
      if (serializedState === null) {
        return initialState;
      }
      return JSON.parse(serializedState);
    } catch (e) {
      console.warn('Failed to load state from sessionStorage', e);
      return initialState;
    }
  }

// save state to session storage
function saveState(state) {
    try {
      const serializedState = JSON.stringify(state);
      sessionStorage.setItem('state', serializedState);
    } catch (e) {
      console.warn('Failed to save state to sessionStorage', e);
    }
  }

const persistedState = loadState();
const store = legacy_createStore(reducer, persistedState);

// Subscribe to store changes to save the state
store.subscribe(() => {
    saveState(store.getState());
  });


export default store;
