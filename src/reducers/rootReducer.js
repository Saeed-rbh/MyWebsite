import { combineReducers } from "redux";

import dataReducer from "./dataReducer";
import menuReducer from "./menuReducer";
import visibilityReducer from "./visibilityReducer";
import currentPageReducer from "./currentPageReducer";

const rootReducer = combineReducers({
  data: dataReducer,
  isMenuOpen: menuReducer,
  visibility: visibilityReducer,
  currentPage: currentPageReducer,
});

export default rootReducer;
