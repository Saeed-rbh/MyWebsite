import { CHANGE_VALUE } from './actions';

const initialState = {
  value: '',
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_VALUE:
      return {
        ...state,
        value: action.payload,
      };
    default:
      return state;
  }
};

export default rootReducer;