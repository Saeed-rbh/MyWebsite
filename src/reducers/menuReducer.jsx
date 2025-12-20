import { MENU } from "../constants/actionTypes";

const initialState = {
  isMenuOpen: false,
};

const menuReducer = (state = initialState, action) => {
  if (action.type === MENU) {
    return {
      ...state,
      isMenuOpen: action.payload,
    };
  }
  return state;
};

export default menuReducer;
