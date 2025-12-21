import { CURRENT_PAGE } from "../constants/actionTypes";

const initialState = {
  currentPage: "/",
};

const currentPageReducer = (state = initialState, action) => {
  switch (action.type) {
    case CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };
    default:
      return state;
  }
};

export default currentPageReducer;
