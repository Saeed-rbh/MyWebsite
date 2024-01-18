import { VISIBILITY } from "../constants/actionTypes";

const initialState = {
  visibility: false,
};

const visibilityReducer = (state = initialState, action) => {
  if (action.type === VISIBILITY) {
    return {
      ...state,
      visibility: action.payload,
    };
  }
  return state;
};

export default visibilityReducer;
