import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "./Menu/menuActions";
import visibilityReducer from "./visibilitySlice"; // import the visibility reducer

const store = configureStore({
  reducer: {
    menu: menuReducer,
    visibility: visibilityReducer, // add the visibility reducer to the store
  },
});

export default store;
