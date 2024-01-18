import { combineReducers } from "redux";

import dataReducer from "./dataReducer";
import menuReducer from "./menuReducer";
import visibilityReducer from "./visibilityReducer";

const rootReducer = combineReducers({
  data: dataReducer,
  isMenuOpen: menuReducer,
  visibility: visibilityReducer,
});

export default rootReducer;
