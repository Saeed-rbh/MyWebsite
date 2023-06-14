import { configureStore } from '@reduxjs/toolkit';
import menuReducer from './menuReducer';

const store = configureStore({
  reducer: {
    menu: menuReducer,
  },
});

export default store;