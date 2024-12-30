// src/redux/reducers/userReducer.js
// ------------------------------------------
import { SET_ENGINEER, SET_MANAGER, SET_LABELER, SET_ADMINISTRATION } from '../types/userTypes';

const initialState = {
  administration: null,
  engineer: null,
  manager: null,
  labeler: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ADMINISTRATION:
      return {
        ...state,
        administration: action.payload,
      };
    case SET_ENGINEER:
      return {
        ...state,
        engineer: action.payload,
      };
    case SET_MANAGER:
      return {
        ...state,
        manager: action.payload,
      };
    case SET_LABELER:
      return {
        ...state,
        labeler: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
// -----------------------------------


