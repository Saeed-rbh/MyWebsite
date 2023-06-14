const initialState = {
  isMenuOpen: false,
};

const menuReducer = (state = initialState, action) => {
  if (action.type === 'UPDATE_MENU') {
    return {
      ...state,
      isMenuOpen: action.payload,
    };
  }
  return state;
};

export default menuReducer;