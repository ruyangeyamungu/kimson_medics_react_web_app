//Action type
export const SET_REG_NO ='SET_REG_NO'
export const SET_NAMES = 'SET_NAMES'

export const setRegNo = (data) => ({
    type: SET_REG_NO,
    payload: data,
  });

export const setNames = (data) => ({
    type: SET_NAMES,
    payload: data,
  });