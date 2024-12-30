// src/redux/actions/userActions.js
// ----------------------------------------
import { SET_ENGINEER, SET_MANAGER, SET_LABELER, SET_ADMINISTRATION } from '../types/userTypes';

export const setAdministration = (user) => ({
  type: SET_ADMINISTRATION,
  payload: user,
});

export const setEngineer = (user) => ({
  type: SET_ENGINEER,
  payload: user,
});

export const setManager = (user) => ({
  type: SET_MANAGER,
  payload: user,
});

export const setLabeler = (user) => ({
  type: SET_LABELER,
  payload: user,
});

// ---------------------------------------------

