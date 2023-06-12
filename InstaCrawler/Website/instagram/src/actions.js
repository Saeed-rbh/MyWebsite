export const CHANGE_VALUE = 'CHANGE_VALUE';

export const changeValueAction = (value) => ({
  type: CHANGE_VALUE,
  payload: value,
});